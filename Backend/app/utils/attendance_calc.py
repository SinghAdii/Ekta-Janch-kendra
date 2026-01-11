from datetime import datetime, timedelta

GRACE_MINUTES = 30

def calculate_worked_minutes(entry_time, exit_time):
    if not entry_time or not exit_time:
        return 0

    start = datetime.combine(datetime.today(), entry_time)
    end = datetime.combine(datetime.today(), exit_time)

    worked = end - start

    # Add grace period
    worked += timedelta(minutes=GRACE_MINUTES)

    return int(worked.total_seconds() / 60)
