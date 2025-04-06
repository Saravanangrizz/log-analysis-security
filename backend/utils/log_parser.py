import re
from datetime import datetime

LOG_PATTERN = re.compile(r'(?P<timestamp>\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}) (?P<level>[A-Z]+) (?P<message>.+) from (?P<ip>\d{1,3}(?:\.\d{1,3}){3})')

def parse_log_line(log_line):
    match = LOG_PATTERN.match(log_line)
    if not match:
        return None

    try:
        timestamp_str = match.group('timestamp')
        timestamp = datetime.strptime(timestamp_str, '%Y-%m-%d %H:%M:%S')
        level = match.group('level')
        message = match.group('message')
        source_ip = match.group('ip')

        return {
            'timestamp': timestamp,
            'level': level,
            'message': message,
            'source_ip': source_ip
        }

    except Exception as e:
        print("Parsing error:", e)
        return None
