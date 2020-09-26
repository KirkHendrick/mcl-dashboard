from datetime import datetime


def current_time():
    return str(datetime.now().strftime("%B")), datetime.now().year
