import unittest
from archive_utils import Archive
import json

class ArchiveUtilsTest(unittest.TestCase):

    def setUp(self) -> None:
        self.archive = Archive('./test_archive.json')
        pass

    def tearDown(self) -> None:
        self.archive.clear_local()
        self.archive.save_to_file()

    def test_retrieve_airtable_records_from_csv_gets_records(self):
        records = Archive.read_rows_from_csv('Pomodoros')

        print(records)
        self.assertNotEqual(0, len(records))

    def test_retrieve_airtable_records_from_csv_gets_records_in_usable_format(self):
        records = Archive.read_rows_from_csv('Pomodoros')
        print(records)

        first_record = records[0]

        self.assertEqual('LP intro meeting', first_record['Name'])

    def test_retrieve_budget_register_from_csv_gets_records_in_usable_format(self):
        records = Archive.read_rows_from_csv('BudgetRegister')

        first_record = records[0]
        print(first_record['Outflow'])

        self.assertEqual('$441.29', first_record['Outflow'])

    def test_get_net_worth_gets_net_worth(self):
        records = Archive.read_rows_from_csv('BudgetRegister')

        net_worth = 0
        for record in records:
            net_worth += float(record['Inflow'][1:])
            net_worth -= float(record['Outflow'][1:])

        self.assertNotEqual(0, net_worth)

    def test_select_all_gets_all_records(self):
        test_record = {'id': 2, 'fields': {}}
        self.archive.insert_records('Pomodoros', [test_record])
        records = self.archive.select_all('Pomodoros')
        self.assertGreater(len(records), 0)

    def test_insert_records_inserts_records(self):
        test_record = {'id': 2, 'fields': {}}
        self.archive.insert_records('Pomodoros', [test_record])
        records = self.archive.select_all('Pomodoros')
        self.assertGreater(len(records), 0)

    def test_save_to_file_dumps_contents(self):
        self.archive.insert_records('Pomodoros', [{
            'id': 1, 'fields': {}
        }])

        self.archive.save_to_file()

        with open('./test_archive.json') as file:
            records = json.load(file)['Pomodoros']

        self.assertGreater(len(records), 0)

    def test_get_entire_archive_gets_values_from_multiple_keys(self):
        self.archive.insert_records('Pomodoros', [{
            'id': 1, 'fields': {}
        }])
        self.archive.insert_records('Tasks', [{
            'id': 2, 'fields': {}
        }])

        records = self.archive.get_entire_archive()

        self.assertGreater(len(records), 1)
