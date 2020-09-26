import requests
import json
from secrets import AIRTABLE_AUTH_URL, AIRTABLE_API_KEY, LAST_MODIFIED_TIME_FILE_PATH
import time
from decimal import *

class AirtableBase:

    def __init__(self, base_id):
        self._base_id = base_id

    @staticmethod
    def get_headers():
        return {
            'Authorization': 'Bearer ' + AIRTABLE_API_KEY
        }

    def retrieve_all_records(self, table_name, wait_time=0):
        offset = 0
        offset_counter = 0
        records = []

        while True:
            response = requests.get(AIRTABLE_AUTH_URL + self._base_id + '/' + table_name,
                                    headers=self.get_headers(),
                                    params={'offset': offset})
            print(f'requesting airtable {table_name} page {offset_counter}...')
            res = response.json()

            if 'records' in res:
                records += res['records']

            if 'offset' in res:
                offset = res['offset']
                offset_counter += 1
                time.sleep(wait_time)
            else:
                break

        return records

    def retrieve_all_records_in_view(self, table_name, view, wait_time=0):
        offset = 0
        offset_counter = 0
        records = []

        while True:
            response = requests.get(AIRTABLE_AUTH_URL + self._base_id + '/' + table_name, headers=self.get_headers(),
                                    params={'view': view, 'offset': offset})
            print(f'requesting airtable {table_name} view {view} page {offset_counter}...')

            res = response.json()
            records += res['records']
            if 'offset' in res:
                offset = res['offset']
                offset_counter += 1
                time.sleep(wait_time)
            else:
                break

        return records

    def retrieve_all_records_since_last_archive(self, table_name, wait_time=0):
        offset = 0
        offset_counter = 0
        records = []

        with open(LAST_MODIFIED_TIME_FILE_PATH) as archive_info_file:
            since_time = archive_info_file.read()

        formula = f"IS_AFTER( LAST_MODIFIED_TIME(), DATEADD('1/1/1970', {since_time}, 'seconds') )"

        while True:
            response = requests.get(AIRTABLE_AUTH_URL + self._base_id + '/' + table_name, headers=self.get_headers(),
                                    params={'filterByFormula': formula, 'offset': offset})
            print(f'requesting recent airtable {table_name} formula {formula} page {offset_counter}...')

            res = response.json()

            if 'error' in res:
                print(f"{res['error']}")

            records += res['records']
            if 'offset' in res:
                offset = res['offset']
                offset_counter += 1
                time.sleep(wait_time)
            else:
                break

        return records

    def create_record(self, table_name, fields):
        response = requests.post(AIRTABLE_AUTH_URL + self._base_id + '/' + table_name, json={
            'fields': fields
        }, headers=self.get_headers())
        return response.json()

    def create_records(self, table_name, records):
        response = requests.post(AIRTABLE_AUTH_URL + self._base_id + '/' + table_name, json={
            'records': records
        }, headers=self.get_headers())
        return response.json()

    def update_record(self, table_name, record_id, field, new_value):
        response = requests.patch(AIRTABLE_AUTH_URL + self._base_id + '/' + table_name, json={
            'records': [
                {
                    'id': record_id,
                    'fields': {
                        field: new_value
                    }
                }
            ]
        }, headers=self.get_headers())
        return response.json()['records'][0]

    def delete_records(self, table_name, record_ids):
        response = requests.delete(AIRTABLE_AUTH_URL + self._base_id + '/' + table_name, params={
            'records[]': record_ids
        }, headers=self.get_headers())
        return response.json()

def convert_to_db_record(record):
    formatted_record = {'id': record['id'], 'createdTime': record['createdTime']}
    for field in record['fields']:
        value = record['fields'][field]

        if isinstance(value, float):
            value = Decimal(str(value))
        elif isinstance(value, list):
            for i, item in enumerate(value):
                if isinstance(item, float):
                    value[i] = Decimal(str(item))

        formatted_record[field] = value
    return formatted_record
