import unittest
import warnings
import time
import github_utils as git
from mock_github import MockGitRepo
from secrets import TEST_REPO_NAME

mock = True

TEST_BRANCH_NAME = 'unit-testing'
TEST_DIRECTORY = 'unit-testing/'
TEST_FILE = 'test_file.txt'
LOG_FILE_DIRECTORY = 'automation-logs/'


class GithubUtilsTest(unittest.TestCase):

    def setUp(self) -> None:
        pass
        warnings.simplefilter('ignore', category=ResourceWarning)
        self.test_repo_name = TEST_REPO_NAME
        self.test_branch_name = TEST_BRANCH_NAME
        self.test_directory = TEST_DIRECTORY
        self.test_file = TEST_FILE

        if mock:
            self.repo = MockGitRepo(self.test_repo_name)
        else:
            self.repo = git.GitRepo(self.test_repo_name)

    def tearDown(self) -> None:
        if not isinstance(self.repo, MockGitRepo):
            self.repo.delete_all_files_in_directory(self.test_directory, 'unit testing teardown', self.test_branch_name)
            prs = self.repo.get_pull_requests()
            if prs.totalCount > 0:
                response = self.repo.merge_pull_request(prs[0].base.ref, prs[0].head.ref,
                                                        'unit testing teardown pr merge')
                print(response)

    def test_get_repo_gets_valid_repo(self):
        self.assertEqual(self.test_repo_name, self.repo._repo_name)

    def test_get_repo_fails_on_invalid_repo(self):
        with self.assertRaises(Exception):
            git.GitRepo('KirkHendrick/testinvalidrepo')

    def test_get_file_can_read_valid_file_contents(self):
        self.repo.create_file(self.test_directory, self.test_file, 'contents', self.test_branch_name,
                              'unit test commit', author='Unit Tester')

        file = self.repo.get_file(self.test_directory, self.test_file, self.test_branch_name)
        self.assertEqual('contents', file['data'])

    def test_get_file_fails_on_invalid_file(self):
        with self.assertRaises(Exception):
            self.repo.get_file(self.test_directory, 'invalidfile.txt', self.test_branch_name)

    def test_get_rate_is_not_close_to_limit(self):
        rate, time_left = self.repo.get_rate()
        print('remaining github api calls: ', rate)
        print('time left until reset: ', time_left)
        self.assertLess(1000, rate)
        if not mock:
            time.sleep(1.5)

    def test_create_file_given_path_and_name_creates_file(self):
        self.repo.create_file(self.test_directory,
                              'created_file.txt', 'contents', self.test_branch_name,
                              'unit test commit', author='Unit Tester')

        testfile = self.repo.get_file(self.test_directory, 'created_file.txt',
                                      self.test_branch_name)

        self.assertEqual('contents', testfile['data'])

    def test_delete_file_given_path_and_name_deletes_file(self):
        self.repo.create_file(self.test_directory,
                              'created_file.txt', 'contents', self.test_branch_name,
                              'unit test commit', author='Unit Tester')

        self.repo.delete_file(self.test_directory, 'created_file.txt',
                              'removed unit test data', self.test_branch_name)

        with self.assertRaises(Exception):
            self.repo.get_file(self.test_directory, 'created_file.txt',
                               self.test_branch_name)

    def test_update_file_given_file_updates_contents(self):
        self.repo.create_file(self.test_directory,
                              'created_file.txt', 'initial contents', self.test_branch_name,
                              'unit test commit', author='Unit Tester')

        self.repo.update_file(self.test_directory, 'created_file.txt', 'unit test changed', self.test_branch_name,
                              'unit test commit',
                              author='Unit Tester')

        testfile = self.repo.get_file(self.test_directory, 'created_file.txt',
                                      self.test_branch_name)

        self.assertEqual('unit test changed', testfile['data'])

    def test_update_file_given_invalid_file_fails(self):
        with self.assertRaises(Exception):
            self.repo.update_file(self.test_directory, 'created_file.txt', 'unit test changed', self.test_branch_name,
                                  'unit test commit')

    def test_get_files_gets_all_files_in_directory(self):
        self.repo.create_file(self.test_directory,
                              'created_file.txt', 'initial contents', self.test_branch_name,
                              'unit test commit', author='Unit Tester')

        self.repo.create_file(self.test_directory,
                              'created_file2.txt', 'initial contents', self.test_branch_name,
                              'unit test commit', author='Unit Tester')

        files = self.repo.get_files(self.test_directory, self.test_branch_name)

        self.assertEqual(2, len(files))

    def test_get_files_gets_files_in_useful_format(self):
        self.repo.create_file(self.test_directory,
                              'created_file.txt', 'initial contents', self.test_branch_name,
                              'unit test commit', author='Unit Tester')

        files = self.repo.get_files(self.test_directory, self.test_branch_name)

        for file in files:
            if file['name'] == 'created_file':
                self.assertEqual('initial contents', file['data'])
                self.assertEqual('created_file.txt', file['raw'].name)

    def test_delete_all_files_in_directory_deletes_two_files(self):
        try:
            self.repo.create_file(self.test_directory,
                                  'created_file.txt', 'initial contents', self.test_branch_name,
                                  'unit test commit', author='Unit Tester')
            self.repo.create_file(self.test_directory,
                                  'created_file2.txt', 'initial contents', self.test_branch_name,
                                  'unit test commit', author='Unit Tester')

            self.repo.delete_all_files_in_directory(self.test_directory, 'unit testing', self.test_branch_name)

            files = self.repo.get_files(self.test_directory, self.test_branch_name)

            self.assertEqual(0, len(files))
        except:
            self.repo.delete_file(self.test_directory, 'created_file.txt',
                                  'removed unit test data', self.test_branch_name)
            self.repo.delete_file(self.test_directory, 'created_file2.txt',
                                  'removed unit test data', self.test_branch_name)

    def test_delete_all_files_in_directory_leaves_files_outside_directory(self):
        try:
            self.repo.create_file(self.test_directory,
                                  'created_file.txt', 'initial contents', self.test_branch_name,
                                  'unit test commit', author='Unit Tester')
            self.repo.create_file(self.test_directory + 'nested/',
                                  'created_file2.txt', 'initial contents', self.test_branch_name,
                                  'unit test commit', author='Unit Tester')

            self.repo.delete_all_files_in_directory(self.test_directory + 'nested/',
                                                    'unit testing', self.test_branch_name)

            files = self.repo.get_files(self.test_directory, self.test_branch_name)

            self.assertEqual(1, len(files))
        except:
            self.repo.delete_file(self.test_directory, 'created_file.txt',
                                  'removed unit test data', self.test_branch_name)
            self.repo.delete_file(self.test_directory + 'nested/', 'created_file2.txt',
                                  'removed unit test data', self.test_branch_name)

    def test_create_pull_request_creates_valid_pr(self):
        title = 'Unit Test PR'
        body = 'unit testing'
        from_branch = self.test_branch_name
        to_branch = 'master'

        self.repo.create_file(self.test_directory,
                              'created_file.txt', 'initial contents', self.test_branch_name,
                              'unit test commit', author='Unit Tester')

        pr = self.repo.create_pull_request(title, body, from_branch, to_branch)
        print(pr)

        self.assertEqual(title, pr.title)

    def test_merge_pull_request_closes_pr(self):
        title = 'Unit Test PR'
        body = 'unit testing'
        from_branch = self.test_branch_name
        to_branch = 'master'

        self.repo.create_file(self.test_directory,
                              'created_file.txt', 'initial contents', self.test_branch_name,
                              'unit test commit', author='Unit Tester')

        pr = self.repo.create_pull_request(title, body, from_branch, to_branch)
        response = self.repo.merge_pull_request(pr.base.ref, pr.head.ref, 'merged unit test pr')
        print(response)

        # not sure why, but it takes a second for the pr to merge
        if not mock:
            while self.repo.get_pull_requests().totalCount != 0:
                pass

        prs = self.repo.get_pull_requests()

        self.assertEqual(0, prs.totalCount)

    def test_get_pull_requests_gets_all_prs(self):
        title = 'Unit Test PR'
        body = 'unit testing'
        from_branch = self.test_branch_name
        to_branch = 'master'

        self.repo.create_file(self.test_directory,
                              'created_file.txt', 'initial contents', self.test_branch_name,
                              'unit test commit', author='Unit Tester')

        self.repo.create_pull_request(title, body, from_branch, to_branch)

        prs = self.repo.get_pull_requests()

        self.assertEqual(1, prs.totalCount)
