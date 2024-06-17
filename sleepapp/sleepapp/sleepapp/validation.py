from django.core.exceptions import BadRequest
from django.utils.dateparse import parse_datetime
from .models import Feeling

def parse_and_validate_datetime(date_to_parse, field_name):
    if not date_to_parse:
        raise BadRequest("'{}' is required".format(field_name))
    
    parsed_date = parse_datetime(date_to_parse)
    if not parsed_date:
        raise BadRequest("'{}' is invalid".format(field_name))
    
    return parsed_date

def validate_feeling_field(feeling, field_name):
    if not feeling:
        raise BadRequest("'{}' is required".format(field_name))
    
    if not feeling in Feeling._value2member_map_:
        raise BadRequest("'{}' is invalid".format(field_name))
    
    return feeling

def validate_bed_time_sleep_interval(bed_time_start, bed_time_end):
    if bed_time_start >= bed_time_end:
        raise BadRequest("bed_time_start must be before the bed_time_end")
