import json
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated 
from rest_framework.views import APIView
from django.http import JsonResponse
from django.db.models import ExpressionWrapper, DurationField, F, Avg, Count

from .models import SleepLog, SleepLogSerializer
from .validation import parse_and_validate_datetime, validate_feeling_field, validate_bed_time_sleep_interval

from rest_framework import generics

@api_view(['GET'])
def ping(request):
    return Response("pong")


class SleepLogView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        date = request.GET.get("date")
        parsed_date = parse_and_validate_datetime(date, "date")

        sleep_log = SleepLog.objects.filter(bed_time_end__date=parsed_date.date(), user_id=request.user.id).order_by("-id").first()
        serialized_obj = SleepLogSerializer(instance=sleep_log).data if sleep_log else None

        return JsonResponse(serialized_obj, safe=False)

    def post(self, request, *args, **kwargs):
        print(request.body)
        data = json.loads(request.body)

        bed_time_start = parse_and_validate_datetime(data["bedTimeStart"], "bedTimeStart")
        bed_time_end = parse_and_validate_datetime(data["bedTimeEnd"], "bedTimeEnd")
        feeling = validate_feeling_field(data["feeling"], "feeling")
        validate_bed_time_sleep_interval(bed_time_start, bed_time_end)

        sleep_log_item = SleepLog.objects.create(
            bed_time_start = bed_time_start,
            bed_time_end = bed_time_end,
            feeling = feeling,
            user_id = request.user.id
        )

        serialized_obj = SleepLogSerializer(instance=sleep_log_item).data
        return JsonResponse(serialized_obj, safe=False)


class SleepLogRangeView(APIView):
    permission_classes = [IsAuthenticated]

    def get_queryset(self, start_date, end_date):
        if start_date and end_date:
            start_date = parse_and_validate_datetime(start_date, "start_date")
            end_date = parse_and_validate_datetime(end_date, "end_date")
            return SleepLog.objects.filter(bed_time_start__date__range=(start_date, end_date))

        return SleepLog.objects.none()

    def get(self, request, *args, **kwargs):

        start_date = self.request.query_params.get('start_date')
        end_date = self.request.query_params.get('end_date')

        sleep_logs = self.get_queryset(start_date, end_date)

        sleep_logs = sleep_logs.annotate(
            total_time_in_bed=ExpressionWrapper(
                F('bed_time_end') - F('bed_time_start'),
                output_field=DurationField()
            )
        )

        total_time_in_bed_avg = sleep_logs.aggregate(avg_total_time=Avg('total_time_in_bed'))
        avg_bed_time_start = sleep_logs.aggregate(avg_bed_time_start=Avg('bed_time_start__time'))
        avg_bed_time_end = sleep_logs.aggregate(avg_bed_time_end=Avg('bed_time_end__time'))
        feeling_freq = sleep_logs.values('feeling').annotate(feeling_count=Count('feeling'))

        data = {
            'range': {
                'start_date': start_date,
                'end_date': end_date,
            },
            'average_total_time_in_bed': str(total_time_in_bed_avg['avg_total_time']),
            'average_bed_time_start': str(avg_bed_time_start['avg_bed_time_start']),
            'average_bed_time_end': str(avg_bed_time_end['avg_bed_time_end']),
            'feeling_frequencies': [{'feeling': item['feeling'], 'count': item['feeling_count']} for item in feeling_freq],
        }

        return JsonResponse(data)
