import unittest

from mock_ynab import MockYnabBudget
import ynab_utils as ynab
from secrets import YNAB_PRIMARY_BUDGET_ID

mock = True

class YnabUtilsTest(unittest.TestCase):

    def setUp(self) -> None:
        self.test_budget = YNAB_PRIMARY_BUDGET_ID
        if mock:
            self.budget = MockYnabBudget(self.test_budget)
        else:
            self.budget = ynab.YnabBudget(self.test_budget)

    def tearDown(self) -> None:
        pass

    def test_get_headers_returns_auth_header(self):
        header = self.budget.get_headers()
        self.assertIn('Authorization', header.keys())

    def test_retrieve_budgets_gets_list_of_budgets(self):
        budgets = self.budget.retrieve_budgets()
        print(budgets)
        self.assertNotEqual(0, len(budgets))

    def test_retrieve_category_groups_gets_list_of_category_groups(self):
        groups = self.budget.retrieve_category_groups()
        print(groups)
        self.assertNotEqual(0, len(groups))

    def test_retrieve_month_gets_month_data(self):
        month = self.budget.retrieve_month()
        print(month)
        self.assertNotEqual(0, len(month['categories']))

    def test_retrieve_accounts_gets_account_info(self):
        accounts = self.budget.retrieve_accounts()
        print(accounts)
        self.assertNotEqual(0, len(accounts))
