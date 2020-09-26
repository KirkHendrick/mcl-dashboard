import uuid

class MockAirtableBase:

    def __init__(self, base_id):
        self._base_id = base_id
        self._table_names = []
        self._records = []
        self._views = [
            {'name': 'Test View',
             'filter': lambda x: x['fields']['In Test View'] is True},
            {'name': 'Default',
             'filter': lambda x: x},
            {'name': 'Unit Testing',
             'filter': lambda x: x},
        ]

    def get_headers(self):
        return {'Authorization': ''}

    def retrieve_all_records(self, table_name):
        return [r for r in self._records if r['table_name'] == table_name]

    def retrieve_all_records_in_view(self, table_name, view):
        records = [r for r in self._records if r['table_name'] == table_name]
        return self._apply_view_filter(view, records)

    def create_record(self, table_name, fields):
        if table_name not in self._table_names:
            self._table_names.append(table_name)

        record = {
            'table_name': table_name,
            'fields': fields,
            'id': str(uuid.uuid4())
        }
        self._records.append(record)

        return record

    def create_records(self, table_name, records):
        for record in records:
            self.create_record(table_name, record['fields'])

        return records

    def delete_records(self, table_name, record_ids):
        self._records = [r for r in [t for t in self._records if t['table_name'] == table_name] if r['id'] not in record_ids]
        return self._records

    def update_record(self, table_name, record_id, field, new_value):
        record = [r for r in self._records if r['table_name'] == table_name and r['id'] == record_id][0]
        record[field] = new_value
        return record

    def _apply_view_filter(self, view_name, records):
        filtered_records = []
        for view in self._views:
            for record in records:
                if view['name'] == view_name:
                    if view['filter'](record):
                        filtered_records.append(record)

        return filtered_records
