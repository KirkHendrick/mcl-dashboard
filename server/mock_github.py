import math

class MockGitRepo:

    def __init__(self, repo_name):
        self._files = []
        self._repo_name = repo_name
        self._pull_requests = MockPaginatedList()

    def get_branch(self, branch_name):
        pass

    def get_file(self, path, name, branch):
        file = None
        for f in self._files:
            if f['path'] + f['raw'].name == path + name:
                return {
                    'path': path,
                    'data': f['data'],
                    'name': name[:-4] if '.txt' in name else name,
                    'raw': MockFile(name)
                }
        if not file:
            raise Exception

    def get_files(self, path, branch="unit-testing"):
        return [f for f in self._files if f['path'] == path]

    def create_file(self, path, name, data, branch, commit_message, author):
        file = {
            'path': path,
            'data': data,
            'name': name[:-4] if '.txt' in name else name,
            'raw': MockFile(name)
        }
        self._files.append(file)
        return file

    def update_file(self, path, name, data, branch, commit_message, author):
        for file in self._files:
            if path + name == file['path'] + file['raw'].name:
                file['data'] = data
                return file

    def delete_file(self, path, name, commit_message, branch):
        self._files = [f for f in self._files if f['path'] + f['raw'].name != path + name]
        return self._files

    def delete_all_files_in_directory(self, path, commit_message, branch):
        self._files = [f for f in self._files if f['path'] != path]
        return self._files

    def get_rate(self):
        return math.inf, 'Mocked'

    def create_pull_request(self, title, body, from_branch, to_branch):
        pr = MockPR(title, from_branch, to_branch)
        self._pull_requests.append(pr)
        return pr

    def get_pull_requests(self):
        return self._pull_requests

    def merge_pull_request(self, from_branch, to_branch, commit_message):
        new_prs = []
        for pr in self._pull_requests._prs:
            if pr.base.ref == from_branch and pr.head.ref == to_branch:
                pass
            else:
                new_prs.append(pr)
        self._pull_requests._prs = new_prs
        return self._pull_requests


class MockFile:

    def __init__(self, name):
        self.name = name

class MockPR:

    def __init__(self, title, from_branch, to_branch):
        self.title = title
        self.from_branch = MockPRBranch(from_branch)
        self.to_branch = MockPRBranch(to_branch)

    @property
    def base(self):
        return self.from_branch

    @property
    def head(self):
        return self.to_branch

class MockPRBranch:

    def __init__(self, name):
        self._name = name

    @property
    def ref(self):
        return self._name

class MockPaginatedList:

    def __init__(self):
        self._prs = []

    @property
    def totalCount(self):
        return len(self._prs)

    def append(self, element):
        self._prs.append(element)