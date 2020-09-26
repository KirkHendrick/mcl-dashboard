import requests
from secrets import YNAB_AUTH_URL, YNAB_ACCESS_TOKEN

class YnabBudget:

    def __init__(self, budget_id):
        self._budget_id = budget_id

    @staticmethod
    def get_headers():
        return {
            'Authorization': 'Bearer ' + YNAB_ACCESS_TOKEN
        }

    def retrieve_budgets(self):
        response = requests.get(YNAB_AUTH_URL + 'budgets', headers=self.get_headers())

        return response.json()['data']['budgets']

    def retrieve_category_groups(self):
        response = requests.get(f'{YNAB_AUTH_URL}budgets/{self._budget_id}/categories',
                                headers=self.get_headers())

        return response.json()['data']['category_groups']

    def retrieve_month(self, month="current"):
        response = requests.get(f'{YNAB_AUTH_URL}budgets/{self._budget_id}/months/{month}',
                                headers=self.get_headers())

        return response.json()['data']['month']

    def retrieve_accounts(self, month="current"):
        response = requests.get(f'{YNAB_AUTH_URL}budgets/{self._budget_id}/accounts',
                                headers=self.get_headers())

        return response.json()['data']['accounts']