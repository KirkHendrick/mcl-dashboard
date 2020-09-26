import unittest
import warnings
import github_utils as git
import misc_utils as util
import airtable_utils as airtable
from mock_github import MockGitRepo
from mock_airtable import MockAirtableBase
from sync_airtable_github import Synchronizer
from secrets import TEST_REPO_NAME, MCL_DEV_BASE_ID

mock = True

TEST_BRANCH_NAME = 'unit-testing'
TEST_DIRECTORY = 'unit-testing/'
TEST_FILE = 'test_file.txt'
LOG_FILE_DIRECTORY = 'automation-logs/'

class SyncTest(unittest.TestCase):
    def setUp(self) -> None:
        warnings.simplefilter('ignore', category=ResourceWarning)
        if mock:
            self.sync = Synchronizer(
                MockGitRepo(TEST_REPO_NAME),
                MockAirtableBase(MCL_DEV_BASE_ID),
                is_test=True
            )
        else:
            self.sync = Synchronizer(
                git.GitRepo(TEST_REPO_NAME),
                airtable.AirtableBase(MCL_DEV_BASE_ID),
                is_test=True
            )
        self.git = self.sync._git
        self.airtable = self.sync._airtable

    def tearDown(self) -> None:
        if not isinstance(self.airtable, MockAirtableBase):
            records = self.airtable.retrieve_all_records('Unit Tests')
            self.airtable.delete_records('Unit Tests', [r['id'] for r in records])
        if not isinstance(self.git, MockGitRepo):
            self.git.delete_all_files_in_directory(TEST_DIRECTORY, 'unit testing teardown', TEST_BRANCH_NAME)
            prs = self.git.get_pull_requests()
            if prs.totalCount > 0:
                response = self.git.merge_pull_request(prs[0].base.ref, prs[0].head.ref,
                                                       'unit testing teardown pr merge')
                print(response)

    def test_import_git_to_at_if_no_files_nothing_added(self):
        self.sync.import_git_directory_to_at_table(TEST_DIRECTORY, 'Unit Tests', 'Default', TEST_BRANCH_NAME)

        records = self.airtable.retrieve_all_records('Unit Tests')
        self.assertEqual(0, len(records))

    def test_import_git_to_at_if_one_file_record_is_created(self):
        self.git.create_file(TEST_DIRECTORY, 'imported.txt', 'from git', TEST_BRANCH_NAME, 'unit testing',
                             'Unit Tester')
        self.sync.import_git_directory_to_at_table(TEST_DIRECTORY, 'Unit Tests', 'Default', TEST_BRANCH_NAME)

        records = self.airtable.retrieve_all_records('Unit Tests')
        self.assertEqual(1, len(records))

    def test_import_git_to_at_if_one_file_contents_are_added(self):
        self.git.create_file(TEST_DIRECTORY, 'imported.txt', 'from git', TEST_BRANCH_NAME, 'unit testing',
                             'Unit Tester')
        self.sync.import_git_directory_to_at_table(TEST_DIRECTORY, 'Unit Tests', 'Default', TEST_BRANCH_NAME)

        records = self.airtable.retrieve_all_records('Unit Tests')
        self.assertEqual('from git', records[0]['fields']['Notes'])

    def test_import_git_to_at_if_files_records_are_created(self):
        self.git.create_file(TEST_DIRECTORY, 'imported.txt', 'from git', TEST_BRANCH_NAME, 'unit testing',
                             'Unit Tester')
        self.git.create_file(TEST_DIRECTORY, 'imported2.txt', 'from git', TEST_BRANCH_NAME, 'unit testing',
                             'Unit Tester')
        self.sync.import_git_directory_to_at_table(TEST_DIRECTORY, 'Unit Tests', 'Default', TEST_BRANCH_NAME)

        records = self.airtable.retrieve_all_records('Unit Tests')
        self.assertEqual(2, len(records))

    def test_import_git_to_at_if_note_already_exists_does_not_add_new(self):
        self.git.create_file(TEST_DIRECTORY, 'imported.txt', 'from git', TEST_BRANCH_NAME, 'unit testing',
                             'Unit Tester')
        self.airtable.create_record('Unit Tests', {
            'Name': 'imported',
            'Notes': 'already here'
        })
        self.sync.import_git_directory_to_at_table(TEST_DIRECTORY, 'Unit Tests', 'Default', TEST_BRANCH_NAME)

        records = self.airtable.retrieve_all_records('Unit Tests')
        self.assertEqual(1, len(records))

    def test_import_git_to_at_if_existing_note_keeps_contents(self):
        self.git.create_file(TEST_DIRECTORY, 'imported.txt', 'from git', TEST_BRANCH_NAME, 'unit testing',
                             'Unit Tester')
        self.airtable.create_record('Unit Tests', {
            'Name': 'imported',
            'Notes': 'already here'
        })
        self.sync.import_git_directory_to_at_table(TEST_DIRECTORY, 'Unit Tests', 'Default', TEST_BRANCH_NAME)

        records = self.airtable.retrieve_all_records('Unit Tests')
        self.assertEqual('already here', records[0]['fields']['Notes'])

    def test_merge_strings_given_same_string_returns_string(self):
        test1 = 'Test content'
        test2 = 'Test content'

        result = self.sync.merge_strings(test1, test2)

        self.assertEqual(test1, result)

    def test_merge_strings_second_string_contains_first_returns_second(self):
        test1 = 'Test content'
        test2 = 'Test content contains the first'

        result = self.sync.merge_strings(test1, test2)

        self.assertEqual(test2, result)

    def test_merge_strings_second_string_different_takes_second(self):
        test1 = 'Test content'
        test2 = 'Test different'

        result = self.sync.merge_strings(test1, test2)

        self.assertEqual(test2, result)

    def test_merge_strings_longer_strings_different_takes_second_words_in_middle(self):
        test1 = 'Test content is different but quite a bit longer. Should combine the two.'
        test2 = 'Test different'

        result = self.sync.merge_strings(test1, test2)

        test_result = 'Test different is different but quite a bit longer. Should combine the two.'
        self.assertEqual(test_result, result)

    def test_commit_at_to_git_given_new_note_file_is_created(self):
        self.airtable.create_record('Unit Tests', {
            'Name': 'test_record',
            'Notes': 'contents'
        })
        self.sync.commit_at_table_to_git_directory('Unit Tests', 'Default', TEST_DIRECTORY, TEST_BRANCH_NAME,
                                                   'sync unit testing'
                                                   )

        records = self.git.get_files(TEST_DIRECTORY, TEST_BRANCH_NAME)
        self.assertEqual(1, len(records))

    def test_commit_at_to_git_given_existing_note_contents_replaced(self):
        self.git.create_file(TEST_DIRECTORY, 'test_record.txt', 'initial',
                             TEST_BRANCH_NAME, 'unit testing', author='Unit Tester')

        self.airtable.create_record('Unit Tests', {
            'Name': 'test_record',
            'Notes': 'contents'
        })
        self.sync.commit_at_table_to_git_directory('Unit Tests', 'Default', TEST_DIRECTORY, TEST_BRANCH_NAME,
                                                   'sync unit testing'
                                                   )

        records = self.git.get_files(TEST_DIRECTORY, TEST_BRANCH_NAME)
        self.assertEqual('contents', records[0]['data'])

    def test_commit_at_to_git_if_changes_creates_pull_request(self):
        self.airtable.create_record('Unit Tests', {
            'Name': 'test_record',
            'Notes': 'contents'
        })
        self.sync.commit_at_table_to_git_directory('Unit Tests', 'Default', TEST_DIRECTORY, TEST_BRANCH_NAME,
                                                   'sync unit testing'
                                                   )

        prs = self.git.get_pull_requests()
        self.assertEqual(1, prs.totalCount)

    def test_commit_at_to_git_if_no_changes_no_pull_request(self):
        self.sync.commit_at_table_to_git_directory('Unit Tests', 'Default', TEST_DIRECTORY, TEST_BRANCH_NAME,
                                                   'sync unit testing'
                                                   )

        prs = self.git.get_pull_requests()
        self.assertEqual(0, prs.totalCount)

    def test_sync_git_notes_with_airtable_new_git_notes_created_in_at(self):
        current_month, current_year = util.current_time()
        file_path = f'{current_year}/{current_month}/notes/'

        try:
            self.git.create_file(file_path, 'test_record.txt', 'initial',
                                 TEST_BRANCH_NAME, 'unit testing', author='Unit Tester')

            self.sync.sync_current_git_notes_with_airtable('Notes', 'Unit Testing', TEST_BRANCH_NAME)

            records = self.airtable.retrieve_all_records_in_view('Notes', 'Unit Testing')

            self.assertEqual(1, len(records))
            self.assertEqual('initial', records[0]['fields']['Notes'])
        finally:
            self.git.delete_all_files_in_directory(file_path, 'unit testing teardown', TEST_BRANCH_NAME)
            records = self.airtable.retrieve_all_records_in_view('Notes', 'Unit Testing')
            self.airtable.delete_records('Notes', [r['id'] for r in records])

    def test_sync_git_notes_with_airtable_new_notes_created_in_git(self):
        current_month, current_year = util.current_time()
        file_path = f'{current_year}/{current_month}/notes/'

        try:
            self.airtable.create_record('Notes', {
                'Name': 'test_record',
                'Notes': 'contents',
                'Test': True
            })

            self.sync.sync_current_git_notes_with_airtable('Notes', 'Unit Testing', TEST_BRANCH_NAME)

            all_files = self.git.get_files(file_path, TEST_BRANCH_NAME)
            files = [f for f in all_files if f['path'] + '/' != file_path + LOG_FILE_DIRECTORY]

            self.assertEqual(1, len(files))
            self.assertEqual('contents', files[0]['data'])
        finally:
            self.git.delete_all_files_in_directory(file_path, 'unit testing teardown', TEST_BRANCH_NAME)
            records = self.airtable.retrieve_all_records_in_view('Notes', 'Unit Testing')
            self.airtable.delete_records('Notes', [r['id'] for r in records])

    def test_sync_git_notes_with_airtable_existing_notes_replaced_in_git(self):
        current_month, current_year = util.current_time()
        file_path = f'{current_year}/{current_month}/notes/'

        try:
            self.airtable.create_record('Notes', {
                'Name': 'test_record',
                'Notes': 'new contents',
                'Test': True
            })

            self.git.create_file(file_path, 'test_record.txt', 'initial',
                                 TEST_BRANCH_NAME, 'unit testing', author='Unit Tester')

            self.sync.sync_current_git_notes_with_airtable('Notes', 'Unit Testing', TEST_BRANCH_NAME)

            all_files = self.git.get_files(file_path, TEST_BRANCH_NAME)
            files = [f for f in all_files if f['path'] + '/' != file_path + LOG_FILE_DIRECTORY]

            self.assertEqual(1, len(files))
            self.assertEqual('new contents', files[0]['data'])
        finally:
            self.git.delete_all_files_in_directory(file_path, 'unit testing teardown', TEST_BRANCH_NAME)
            records = self.airtable.retrieve_all_records_in_view('Notes', 'Unit Testing')
            self.airtable.delete_records('Notes', [r['id'] for r in records])

    def test_sync_git_notes_with_airtable_log_file_created(self):
        current_month, current_year = util.current_time()
        file_path = f'{current_year}/{current_month}/notes/'

        try:
            self.airtable.create_record('Notes', {
                'Name': 'test_record',
                'Notes': 'new contents',
                'Test': True
            })

            self.git.create_file(file_path, 'test_record.txt', 'initial',
                                 TEST_BRANCH_NAME, 'unit testing', author='Unit Tester')

            self.sync.sync_current_git_notes_with_airtable('Notes', 'Unit Testing', TEST_BRANCH_NAME)

            files = self.git.get_files(file_path + LOG_FILE_DIRECTORY, TEST_BRANCH_NAME)

            self.assertEqual(1, len(files))
        finally:
            self.git.delete_all_files_in_directory(file_path, 'unit testing teardown', TEST_BRANCH_NAME)
            records = self.airtable.retrieve_all_records_in_view('Notes', 'Unit Testing')
            self.airtable.delete_records('Notes', [r['id'] for r in records])

    def test_sync_git_notes_with_airtable_log_file_contains_responses(self):
        current_month, current_year = util.current_time()
        file_path = f'{current_year}/{current_month}/notes/'

        try:
            self.airtable.create_record('Notes', {
                'Name': 'test_record',
                'Notes': 'new contents',
                'Test': True
            })

            self.git.create_file(file_path, 'test_file.txt', 'initial',
                                 TEST_BRANCH_NAME, 'unit testing', author='Unit Tester')

            self.sync.sync_current_git_notes_with_airtable('Notes', 'Unit Testing', TEST_BRANCH_NAME)

            files = self.git.get_files(file_path + LOG_FILE_DIRECTORY, TEST_BRANCH_NAME)

            self.assertIn('test_record', files[0]['data'])
            self.assertIn('test_file', files[0]['data'])
        finally:
            self.git.delete_all_files_in_directory(file_path, 'unit testing teardown', TEST_BRANCH_NAME)
            records = self.airtable.retrieve_all_records_in_view('Notes', 'Unit Testing')
            self.airtable.delete_records('Notes', [r['id'] for r in records])
