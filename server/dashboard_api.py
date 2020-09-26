from airtable_utils import AirtableBase
from github_utils import GitRepo
from aws_utils import AWS
from ynab_utils import YnabBudget
from misc_utils import current_time
from datetime import datetime
from datetime import timezone
import random
import json
import time
import threading
from secrets import MCL_BASE_ID, HEALTH_BASE_ID, BOOKS_BASE_ID, MCL_REPO_NAME, TEST_REPO_NAME, \
    YNAB_PRIMARY_BUDGET_ID

AUTO_REFRESH_METHODS = [
    'get_todays_pomodoros', 'get_todays_tasks',
    'get_todays_meals', 'get_todays_active_minutes'
]

class DashboardApi:
    @staticmethod
    def get_entire_archive(payload=None, socket=None):
        # print('getting archive...')
        # # archive = Archive('./archive/archive.json')
        # with open('./archive/archive.json') as file:
        #     records = json.load(file)
        # print('got archive.')
        socket.send_json({'type': 'GET_ENTIRE_ARCHIVE_SUCCESS', 'archive': []})

    @staticmethod
    def create_repeating_records(payload=None, socket=None):
        base = AirtableBase(MCL_BASE_ID)
        records = base.retrieve_all_records_in_view('Repeating', 'Active')

        for record in [r['fields'] for r in records]:
            fields = json.loads(record['fields'])
            new_record = {
                'Category': record['Category'],
                'Owner': record['Owner']
            }
            for field in fields:
                if field['method']:
                    new_record[field['name']] = getattr(RepeatingMethods, field['value'])()
                else:
                    new_record[field['name']] = field['value']

            response = base.create_record(record['Table'], new_record)
            print(response)
        socket.send_json({'type': 'CREATE_REPEATING_RECORDS_SUCCESS'})

    @staticmethod
    def log_compulsion(payload=None, socket=None):
        base = AirtableBase(HEALTH_BASE_ID)
        base.create_record('Compulsions', {})

    @staticmethod
    def get_todays_water(payload=None, socket=None):
        base = AirtableBase(HEALTH_BASE_ID)
        water_log = base.retrieve_all_records_in_view('Water', 'Today')
        socket.send_json({'type': 'GET_TODAYS_WATER_SUCCESS',
                          'waterLog': water_log[0] if len(water_log) else None})

    @staticmethod
    def get_todays_active_minutes(payload=None, socket=None):
        base = AirtableBase(HEALTH_BASE_ID)
        log = base.retrieve_all_records_in_view('Activity Log', 'Today')

        socket.send_json({'type': 'GET_TODAYS_ACTIVE_MINUTES_SUCCESS', 'activeMinutes': log})

    @staticmethod
    def get_point_rules(payload=None, socket=None):
        base = AirtableBase(MCL_BASE_ID)
        rules = base.retrieve_all_records('Point Rules')
        socket.send_json({'type': 'GET_POINT_RULES_SUCCESS', 'pointRules': rules})

    @staticmethod
    def get_todays_health_bar(payload=None, socket=None):
        base = AirtableBase(HEALTH_BASE_ID)
        health_bar = base.retrieve_all_records_in_view('Health Bar', 'Today')
        socket.send_json({'type': 'GET_TODAYS_HEALTH_BAR_SUCCESS', 'healthBar': health_bar[0]})

    @staticmethod
    def log_water(payload=None, socket=None):
        base = AirtableBase(HEALTH_BASE_ID)
        water_log = base.retrieve_all_records_in_view('Water', 'Today')
        if len(water_log):
            todays_log = water_log[0]
            log = base.update_record('Water', todays_log['id'], 'Number', todays_log['fields']['Number'] + 1)
        else:
            log = base.create_record('Water', {'Number': 1, 'Date': datetime.now().strftime('%Y-%m-%d')})

        socket.send_json({'type': 'GET_TODAYS_WATER_SUCCESS', 'waterLog': log})

    @staticmethod
    def start_auto_refresh(payload=None, socket=None):
        def infinite_refresh():
            while True:
                for method in AUTO_REFRESH_METHODS:
                    print(f'Thread {threading.get_ident()}: refreshing {method}')
                    response = getattr(DashboardApi, method)(payload=None, socket=socket)
                    time.sleep(0.5)

        thread = threading.Thread(target=infinite_refresh)
        thread.start()

    @staticmethod
    def start_pomodoro_timer(payload=None, socket=None):
        base = AirtableBase(MCL_BASE_ID)
        active_pomodoros = [r for r in base.retrieve_all_records_in_view('Pomodoros', 'Active')]
        if len(active_pomodoros) > 0:
            active_pomodoro = base.update_record('Pomodoros', active_pomodoros[0]['id'], 'Started', True)
            socket.send_json({'type': 'POMODORO_TIMER_STARTED', 'active': active_pomodoro})
        else:
            socket.send_json({'type': 'POMODORO_TIMER_STARTED', 'active': {'id': None}})

    @staticmethod
    def stop_pomodoro_timer(payload=None, socket=None):
        with open('state/pomodoro_timer.json', 'r') as file:
            file_json = json.load(file)
            time_left = file_json['time_left']
            socket.send_json({'type': 'POMODORO_TIMER_STOPPED', 'time_left': time_left, 'running': False})

    @staticmethod
    def get_current_pomodoro_time(payload=None, socket=None):
        base = AirtableBase(MCL_BASE_ID)
        active_pomodoros = [r for r in base.retrieve_all_records_in_view('Pomodoros', 'Active')]

        socket.send_json({'type': 'CURRENT_POMODORO_TIME_SENT', 'active': active_pomodoros[0]})
        return active_pomodoros[0]

    @staticmethod
    def set_current_pomodoro_time(payload=None, socket=None):
        base = AirtableBase(MCL_BASE_ID)
        if payload['active']:
            active = payload['active']
            active_pomodoro = base.update_record('Pomodoros', active['id'], 'Time Left',
                                                 active['Time Left'] - 1 if 'Time Left' in active else 1499)
            socket.send_json({'type': 'CURRENT_POMODORO_TIME_SENT', 'active': active_pomodoro})

    @staticmethod
    def get_pages(payload=None, socket=None):
        table = AWS.DynamoDBTable('Pages')
        pages = table.retrieve_all_records()
        socket.send_json({'type': 'GET_PAGES_SUCCESS', 'pages': table.decode(pages)})

    @staticmethod
    def get_widgets(payload=None, socket=None):
        table = AWS.DynamoDBTable('Widgets')
        widgets = table.retrieve_all_records()
        socket.send_json({'type': 'GET_WIDGETS_SUCCESS', 'widgets': table.decode(widgets)})

    @staticmethod
    def get_random_quote(payload=None, socket=None):
        table = AWS.DynamoDBTable('Quotes')
        records = table.retrieve_all_records()
        rand_quote = random.choice([r for r in records])
        socket.send_json({'type': 'GET_RANDOM_QUOTE_SUCCESS', 'quote': table.decode(rand_quote)})

    @staticmethod
    def get_todays_past_logs(payload=None, socket=None):
        repo = GitRepo(MCL_REPO_NAME)
        month, _ = current_time()
        day = datetime.today().day
        day_leading = datetime.today().strftime("%d")
        month_leading = datetime.today().strftime("%m")
        year_leading = datetime.today().strftime("%y")

        '2016/personal/{month}/journal/{day}.txt'
        '2017/personal/{month}/journal/{day}.txt'
        '2018/{month}/log/0{day}.txt'  # leading zeroes
        '2019/{month}/log/{year}-{month}-{day}.txt'  # leading zeroes

        logs = []

        try:
            sixteen = repo.get_file('2016/personal/' + month + '/journal/', str(day) + '.txt')
            logs.append({
                'text': sixteen['data'],
                'path': sixteen['path'],
                'year': 2016
            })
        except Exception:
            logs.append({
                'text': 'No log from 2016.\n\n',
                'path': '',
                'year': 2016
            })

        try:
            seventeen = repo.get_file('2017/personal/' + month + '/journal/', str(day) + '.txt')
            logs.append({
                'text': seventeen['data'],
                'path': seventeen['path'],
                'year': 2017
            })
        except Exception:
            logs.append({
                'text': 'No log from 2017.\n\n',
                'path': '',
                'year': 2017
            })

        try:
            path, name = '2018/' + month + '/log/', str(day_leading) + '.txt'
            print(path, name)
            eighteen = repo.get_file(path, name)
            logs.append({
                'text': eighteen['data'],
                'path': eighteen['path'],
                'year': 2018
            })
        except Exception:
            logs.append({
                'text': 'No log from 2018.\n\n',
                'path': '',
                'year': 2018
            })

        try:
            path, name = '2019/' + month + '/log/', '2019' + '-' + month_leading + '-' + str(
                day_leading) + '.txt'
            print(path, name)
            nineteen = repo.get_file(path, name)
            logs.append({
                'text': nineteen['data'],
                'path': nineteen['path'],
                'year': 2019
            })
        except Exception as e:
            logs.append({
                'text': 'No log from 2019.\n\n',
                'path': '',
                'year': 2019
            })

        socket.send_json({'type': 'GET_TODAYS_PAST_LOGS_SUCCESS', 'logs': logs})

    @staticmethod
    def get_todays_pomodoros(payload=None, socket=None):
        base = AirtableBase(MCL_BASE_ID)
        pomodoros = [r for r in base.retrieve_all_records_in_view('Pomodoros', 'Today')]
        socket.send_json({'type': 'GET_TODAYS_POMODOROS_SUCCESS', 'pomodoros': pomodoros})

    @staticmethod
    def get_morning_checklist(payload=None, socket=None):
        base = AirtableBase(MCL_BASE_ID)
        records = base.retrieve_all_records_in_view('Checklists', 'Morning Checklist')

        record_map = {}
        for record in [r['fields'] for r in records]:
            category = record['Category Name'][0]
            if category in record_map:
                record_map[category].append({
                    'label': record['Name'],
                    'checked': False
                })
            else:
                record_map[category] = [{
                    'label': record['Name'],
                    'checked': False
                }]

        checklists = []
        for category in record_map:
            checklists.append({
                'name': category,
                'items': record_map[category]
            })

        socket.send_json({'type': 'GET_MORNING_CHECKLIST_SUCCESS', 'checklists': checklists})

    @staticmethod
    def get_todays_tasks(payload=None, socket=None):
        base = AirtableBase(MCL_BASE_ID)
        tasks = [r for r in base.retrieve_all_records_in_view('Tasks', 'Today')]
        socket.send_json({'type': 'GET_TODAYS_TASKS_SUCCESS', 'tasks': tasks})

    @staticmethod
    def get_budget_categories(payload=None, socket=None):
        budget = YnabBudget(YNAB_PRIMARY_BUDGET_ID)
        category_groups = budget.retrieve_category_groups()
        socket.send_json({'type': 'GET_BUDGET_CATEGORIES_SUCCESS', 'category_groups': category_groups})

    @staticmethod
    def get_budget_accounts(payload=None, socket=None):
        budget = YnabBudget(YNAB_PRIMARY_BUDGET_ID)
        accounts = budget.retrieve_accounts()
        socket.send_json({'type': 'GET_BUDGET_ACCOUNTS_SUCCESS', 'accounts': accounts})

    @staticmethod
    def get_budget_current_month(payload=None, socket=None):
        budget = YnabBudget(YNAB_PRIMARY_BUDGET_ID)
        month = budget.retrieve_month()
        socket.send_json({'type': 'GET_BUDGET_CURRENT_MONTH_SUCCESS', 'month': month})

    @staticmethod
    def get_todays_meals(payload=None, socket=None):
        base = AirtableBase(HEALTH_BASE_ID)
        records = base.retrieve_all_records_in_view('Food Log', 'Today')
        socket.send_json({'type': 'GET_TODAYS_MEALS_SUCCESS', 'meals': records})

    @staticmethod
    def get_yesterdays_meals(payload=None, socket=None):
        base = AirtableBase(HEALTH_BASE_ID)
        records = base.retrieve_all_records_in_view('Food Log', 'Yesterday')
        socket.send_json({'type': 'GET_YESTERDAYS_MEALS_SUCCESS', 'meals': records})

    @staticmethod
    def get_continuous_goals(payload=None, socket=None):
        # base = AirtableBase(MCL_BASE_ID)
        # records = base.retrieve_all_records_in_view('Goals', 'Continuous')

        table = AWS.DynamoDBTable('Goals')
        records = table.retrieve_all_records_where_exists('Continuity')

        socket.send_json({'type': 'GET_CONTINUOUS_GOALS_SUCCESS', 'goals': table.decode(records)})

    # not converted to sockets yet

    @staticmethod
    def pomodoros_this_year():
        base = AirtableBase(MCL_BASE_ID)
        return base.retrieve_all_records_in_view('Pomodoros', 'This Year')

    @staticmethod
    def active_pomodoro():
        base = AirtableBase(MCL_BASE_ID)
        return [r for r in base.retrieve_all_records_in_view('Pomodoros', 'Active')]

    @staticmethod
    def increment_active_pomodoro():
        base = AirtableBase(MCL_BASE_ID)
        pomodoros = DashboardApi.active_pomodoro()
        print(pomodoros)
        if len(pomodoros) > 0:
            record = base.update_record('Pomodoros', pomodoros[0]['id'], 'Number', pomodoros[0]['fields']['Number'] + 1)
            print(record)
            return record
        return {}

    @staticmethod
    def yesterdays_pomodoros():
        base = AirtableBase(MCL_BASE_ID)
        return [r for r in base.retrieve_all_records_in_view('Pomodoros', 'Yesterday')]

    @staticmethod
    def me_inc_tasks():
        base = AirtableBase(MCL_BASE_ID)
        return [r for r in base.retrieve_all_records_in_view('Tasks', 'Me, Inc.')]

    @staticmethod
    def me_inc_notes():
        base = AirtableBase(MCL_BASE_ID)
        return [r for r in base.retrieve_all_records_in_view('Notes', 'Me, Inc.')]

    @staticmethod
    def weight_data():
        base = AirtableBase(HEALTH_BASE_ID)
        return [r for r in base.retrieve_all_records('Weight Log')]

    @staticmethod
    def budget_month(month):
        budget = YnabBudget(YNAB_PRIMARY_BUDGET_ID)
        return budget.retrieve_month(month)


class RepeatingMethods:

    @staticmethod
    def todays_date():
        return datetime.now().strftime('%Y-%m-%d')
