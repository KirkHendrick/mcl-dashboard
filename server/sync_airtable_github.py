#! /usr/bin/env python3

from github_utils import GitRepo
from airtable_utils import AirtableBase
import misc_utils as util
from pprint import pprint
import jsonpickle
from secrets import MCL_DEV_BASE_ID, TEST_REPO_NAME, GITHUB_AUTHOR_NAME

class Synchronizer:

    def __init__(self, git, airtable, is_test=False):
        self._git = git if git else GitRepo(TEST_REPO_NAME)
        self._airtable = airtable if airtable else AirtableBase(MCL_DEV_BASE_ID)
        self._log = []
        self._is_test = is_test

    if __name__ == '__main__':
        pass

    def import_git_directory_to_at_table(self, directory_name, table_name, view_name, branch_name):
        files = self._git.get_files(directory_name, branch_name)
        raw_records = self._airtable.retrieve_all_records_in_view(table_name, view_name)
        records = [r['fields'] for r in raw_records]
        pprint(files)

        new_records = []
        for file in files:
            if file['name'] not in [r['Name'] for r in records]:
                new_records.append({
                    'fields': {
                        'Name': file['name'],
                        'Notes': file['data'],
                        'Test': self._is_test
                    }
                })

        if len(new_records) > 0:
            return [self._airtable.create_records(table_name, new_records)]

    def commit_at_table_to_git_directory(self, table_name, table_view, directory_name, branch_name, commit_message,
                                         author=GITHUB_AUTHOR_NAME):
        raw_records = self._airtable.retrieve_all_records_in_view(table_name, table_view)
        files = self._git.get_files(directory_name, branch_name)
        records = [r['fields'] for r in raw_records]
        responses = []

        create_pr = False
        for record in records:
            if record['Name'] not in [f['name'] for f in files]:
                if len(record['Name'].split(' ')) > 10:
                    file_name = ' '.join(record['Name'].split(' ')[:10]).replace('/', '')
                else:
                    file_name = record['Name'].replace('/', '')

                res = self._git.create_file(f"{directory_name}", f"{file_name}.txt",
                                            record['Notes'] if 'Notes' in record else '',
                                            branch_name, commit_message,
                                            author)
                create_pr = True
                responses.append(res)
            else:
                res = self._git.update_file(f"{directory_name}", f"{record['Name']}.txt",
                                            record['Notes'],
                                            branch_name, commit_message,
                                            author)
                create_pr = True
                responses.append(res)

        if create_pr:
            self._git.create_pull_request(f"Commit {table_name} to {directory_name}", '', branch_name, 'master')

        return responses

    @staticmethod
    def merge_strings(first, second):
        merged = []
        first_words = first.split(' ')
        second_words = second.split(' ')
        longer = first_words if len(first) > len(second) else second_words
        for index, _ in enumerate(longer):
            f = first_words[index] if index < len(first_words) else ''
            s = second_words[index] if index < len(second_words) else ''
            if f != s:
                merged.append(f if not s else s)
            else:
                merged.append(f)

        return ' '.join(merged)

    def sync_current_git_notes_with_airtable(self, table_name, table_view, branch):
        current_month, current_year = util.current_time()
        file_path = f'{current_year}/{current_month}/notes/'

        try:
            self._l(self.import_git_directory_to_at_table(file_path, table_name, table_view, branch))
            self._l(self.commit_at_table_to_git_directory(table_name, table_view, file_path, branch, 'Syncing notes with '
                                                                                          'airtable'))
        except Exception as e:
            self._l(e)
        finally:
            self._git.create_file(
                file_path + 'automation-logs/',
                'log.txt',
                '\n\n'.join(self._log),
                branch, 'automation-log',
                author=GITHUB_AUTHOR_NAME
            )



    def _l(self, entry):
        if isinstance(entry, list):
            for e in entry:
                self._l(e)
        else:
            pprint(entry)
            if entry is not None:
                self._log.append(
                    jsonpickle.encode(entry, unpicklable=False)
                )

