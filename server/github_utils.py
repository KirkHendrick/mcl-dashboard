import github
from datetime import datetime
from secrets import GITHUB_ACCESS_TOKEN, GITHUB_AUTHOR_EMAIL

class GitRepo:

    def __init__(self, repo_name, git_lib=github.Github):
        self._repo_name = repo_name
        self._git = git_lib(GITHUB_ACCESS_TOKEN)
        self._repo = self._git.get_repo(repo_name)

    def get_file(self, path, file_name, branch="master"):
        file = self._repo.get_contents(path + file_name, ref=branch)
        return {
            'name': file.name[:-4] if '.txt' in file.name else file.name,
            'data': file.decoded_content.decode('utf-8'),
            'raw': file,
            'path': path
        }

    def get_files(self, path, branch):
        files = []

        try:
            raw_files = self._repo.get_contents(path, ref=branch)
        except:
            return files

        for raw_file in raw_files:
            if raw_file.name != '.DS_Store':
                if raw_file.type == 'dir':
                    files = files + self.get_files(raw_file.path, branch)
                else:
                    files.append({
                        'name': raw_file.name[:-4] if '.txt' in raw_file.name else raw_file.name,
                        'data': raw_file.decoded_content.decode('utf-8') if raw_file.content else '',
                        'raw': raw_file,
                        'path': path
                    })

        return files

    def create_file(self, file_path, file_name, file_data, branch_name, commit_message, author='Integration'):
        author = github.InputGitAuthor(author, GITHUB_AUTHOR_EMAIL)
        return self._repo.create_file(file_path + file_name, commit_message, file_data, branch=branch_name,
                                     author=author)

    def update_file(self, file_path, file_name, file_data, branch_name, commit_message, author='Integration'):
        author = github.InputGitAuthor(author, GITHUB_AUTHOR_EMAIL)
        contents = self._repo.get_contents(file_path + file_name, ref=branch_name)
        return self._repo.update_file(contents.path, commit_message, file_data, contents.sha, branch=branch_name,
                                author=author)

    def delete_file(self, path, file_name, commit_message, branch, raw_file=None):
        if raw_file:
            contents = raw_file
        else:
            contents = self._repo.get_contents(path + file_name, ref=branch)
        return self._repo.delete_file(contents.path, commit_message, contents.sha, branch=branch)

    def delete_all_files_in_directory(self, path, commit_message, branch):
        files = self.get_files(path, branch)
        for file in files[:]:
            raw_file = file['raw']
            if raw_file.type == 'dir':
                return self.delete_all_files_in_directory(raw_file.path, commit_message, branch)
            else:
                if path in file['path']:
                    self.delete_file(file['path'], raw_file.name, commit_message, branch, raw_file=raw_file)

    def get_rate(self):
        rate_limit = self._git.get_rate_limit().core
        return rate_limit.remaining, rate_limit.reset - datetime.now()

    def create_pull_request(self, title, body, from_branch, to_branch):
        return self._repo.create_pull(title=title, body=body, head=from_branch, base=to_branch)

    def get_pull_requests(self):
        return self._repo.get_pulls()

    def merge_pull_request(self, from_branch, to_branch, commit_message):
        return self._repo.merge(from_branch, to_branch, commit_message)
