#! /usr/bin/env python3

import boto3
import decimal
import json
from boto3.dynamodb.conditions import Attr
import airtable_utils as airtable
from secrets import PUBLIC_IP

LOCAL_ENDPOINT_URL = f'http://{PUBLIC_IP}:8000'

def print_progress_bar(iteration, total, prefix='', suffix='', decimals=1, length=100, fill='█', print_end="\r"):
    percent = ("{0:." + str(decimals) + "f}").format(100 * (iteration / float(total)))
    filled_length = int(length * iteration // total)
    bar = fill * filled_length + '-' * (length - filled_length)
    print(f'\r{prefix} |{bar}| {percent}% {suffix}', end=print_end)
    if iteration == total:
        print()

class AWS:

    def __init__(self):
        pass

    class Lambda:
        def __init__(self, lambda_name):
            self._client = boto3.client('lambda')
            self._lambda_name = lambda_name

        def invoke(self):
            response = self._client.invoke(FunctionName=self._lambda_name)
            return self.decode(response)

        @staticmethod
        def decode(response):
            payload = response['Payload'].read()
            return payload.decode('utf-8')

    class DynamoDBTable:

        def __init__(self, table_name, local=True):
            if local:
                self._resource = boto3.resource('dynamodb', endpoint_url=LOCAL_ENDPOINT_URL)
                self._client = boto3.client('dynamodb', endpoint_url=LOCAL_ENDPOINT_URL)
            else:
                self._resource = boto3.resource('dynamodb')
                self._client = boto3.client('dynamodb')
            self._table_name = table_name.replace(' ', '-')
            self._table = self._resource.Table(self._table_name)

        def exists(self):
            try:
                describe = self._client.describe_table(TableName=self._table_name)
            except:
                return False

            if describe['Table']['TableStatus'] == 'CREATING':
                return False

            return True

        def create(self):
            return self._resource.create_table(
                TableName=self._table_name,
                KeySchema=[
                    {
                        'AttributeName': 'id',
                        'KeyType': 'HASH'
                    }
                ],
                AttributeDefinitions=[
                    {
                        'AttributeName': 'id',
                        'AttributeType': 'S'
                    }
                ],
                ProvisionedThroughput={
                    'ReadCapacityUnits': 5,
                    'WriteCapacityUnits': 5
                }
            )

        def retrieve_all_records(self):
            print(f"requesting dynamodb {self._table_name}...")
            response = self._table.scan()
            return response['Items']

        def retrieve_all_records_where_equals(self, subject, predicate):
            print(f"requesting dynamodb {self._table_name} where {subject} == {predicate}...")
            response = self._table.scan(
                FilterExpression=Attr(subject).eq(predicate)
            )
            return response['Items']

        def retrieve_all_records_where_exists(self, attribute):
            print(f"requesting dynamodb {self._table_name} where {attribute} exists")
            response = self._table.scan(
                FilterExpression=Attr(attribute).exists()
            )
            return response['Items']

        def put_airtable_record(self):
            pass

        def put_record(self, record):
            response = self._table.put_item(Item=airtable.convert_to_db_record(record))
            return response

        def create_records(self, table_name, records):
            pass

        def delete_records(self, table_name, record_ids):
            pass

        def put_airtable_table(self, base, airtable_table_name, airtable_records=None):
            responses = []
            records = airtable_records if airtable_records else base.retrieve_all_records_since_last_archive(airtable_table_name, wait_time=0.4)

            for index, record in enumerate(records):
                print_progress_bar(index + 1, len(records),
                                   prefix=f'putting record {record["id"]} in table {airtable_table_name}',
                                   suffix='Complete',
                                   length=50)
                responses.append(
                    self._table.put_item(Item=airtable.convert_to_db_record(record))
                )

            print(f'put {len(records)} {airtable_table_name} dynamodb records')
            return responses

        def decode(self, records):
            class DecimalEncoder(json.JSONEncoder):
                def default(self, o):
                    if isinstance(o, decimal.Decimal):
                        if o % 1 > 0:
                            return float(o)
                        else:
                            return int(o)
                    return super(DecimalEncoder, self).default(o)

            return json.dumps(records, cls=DecimalEncoder)


if __name__ == '__main__':
    pages_table = AWS.DynamoDBTable('pages')
    widgets_table = AWS.DynamoDBTable('widgets')

    pages_table.put_airtable_table(MCL_BASE_ID, 'Pages')
    widgets_table.put_airtable_table(MCL_BASE_ID, 'Widgets')
