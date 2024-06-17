from django.conf import settings
from django.db import models
from rest_framework import serializers


class Feeling(models.IntegerChoices):
    Bad = 1, "Bad"
    Ok = 2, "Ok"
    Good = 3, "Good"

class SleepLog(models.Model):
    feeling = models.IntegerField(choices=Feeling.choices)
    bed_time_start = models.DateTimeField()
    bed_time_end = models.DateTimeField()
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.RESTRICT
    )

class SleepLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = SleepLog
        fields = ["id", "feeling", "bed_time_start", "bed_time_end"]
