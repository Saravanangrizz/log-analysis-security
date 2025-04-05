import re
from datetime import datetime

log_pattern = re.compile(
    r'(?P<ip>\S+) - - \[(?P<timestamp>[^\]]+)\] "(?P<method>\S+) (?P<url>\S+) \S+" (?P<status>\d{3}) (?P<size>\d+)'
)

def parse_log_line(line):
    match = log_pattern.match(line)
    if match:
        data = match.groupdict()
        data['timestamp'] = datetime.strptime(data['timestamp'], "%d/%b/%Y:%H:%M:%S %z")
        return data
    return None
