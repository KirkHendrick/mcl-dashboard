import unittest
import airtable_utils as airtable
from mock_airtable import MockAirtableBase
import secrets

mock = True

class AirtableUtilsTest(unittest.TestCase):

    def setUp(self) -> None:
        self.test_base = secrets.MCL_DEV_BASE_ID
        self.test_table = 'Unit Tests'
        if mock:
            self.base = MockAirtableBase(self.test_base)
        else:
            self.base = airtable.AirtableBase(self.test_base)

    def tearDown(self) -> None:
        if not isinstance(self.base, MockAirtableBase):
            records = self.base.retrieve_all_records(self.test_table)
            self.base.delete_records(self.test_table, [r['id'] for r in records])

    def test_get_headers_returns_auth_header(self):
        header = self.base.get_headers()
        self.assertIn('Authorization', header.keys())

    def test_retrieve_all_records_given_empty_gets_none(self):
        records = self.base.retrieve_all_records(self.test_table)
        self.assertEqual(0, len(records))

    def test_retrieve_all_records_given_table_with_one_gets_it(self):
        self.base.create_record(self.test_table, {
            'Name': 'Test Record'
        })

        records = self.base.retrieve_all_records(self.test_table)
        self.assertEqual(1, len(records))

    def test_update_record_given_id_and_field_updates_it(self):
        self.base.create_record(self.test_table, {
            'Name': 'Test Record'
        })

        record = self.base.retrieve_all_records(self.test_table)[0]

        updated_record = self.base.update_record(self.test_table, record['id'], 'Name', 'Updated')

        self.assertEqual('Updated', updated_record['fields']['Name'])

    def test_delete_records_given_one_record_deletes_it(self):
        record = self.base.create_record(self.test_table, {
            'Name': 'Test Record'
        })

        self.base.delete_records(self.test_table, [record['id']])

        records = self.base.retrieve_all_records(self.test_table)
        self.assertEqual(0, len(records))

    def test_delete_records_given_multiple_records_deletes_them(self):
        self.base.create_record(self.test_table, {
            'Name': 'Test Record'
        })

        self.base.create_record(self.test_table, {
            'Name': 'Test Record 2'
        })

        records = self.base.retrieve_all_records(self.test_table)

        self.base.delete_records(self.test_table, [r['id'] for r in records])

        records = self.base.retrieve_all_records(self.test_table)
        self.assertEqual(0, len(records))

    def test_retrieve_all_records_in_view(self):
        self.base.create_record(self.test_table, {
            'Name': 'Test Record',
            'In Test View': True
        })

        self.base.create_record(self.test_table, {
            'Name': 'Test Record 2',
            'In Test View': False
        })

        records = self.base.retrieve_all_records_in_view(self.test_table, 'Test View')

        self.assertEqual(1, len(records))

    def test_create_records_creates_multiple_records(self):
        self.base.create_records(self.test_table, [
            {'fields': {'Name': 'Test Record'}},
            {'fields': {'Name': 'Test Record 2'}},
        ])

        records = self.base.retrieve_all_records(self.test_table)

        self.assertEqual(2, len(records))

    def test_retrieve_all_records_in_view_gets_more_than_100_records(self):
        records = self.base.retrieve_all_records_in_view('Tasks', 'Everything')

        print(len(records))
        self.assertGreater(len(records), 101)

    def test_retrieve_all_records_gets_more_than_100_records(self):
        records = self.base.retrieve_all_records('Tasks')

        print(len(records))
        self.assertGreater(len(records), 301)

    def test_retrieve_all_records_since_last_archive_only_gets_recent_records(self):
        pass