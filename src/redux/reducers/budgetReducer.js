import types from '../common/actionTypes';
import initialState from "../common/initialState";

export default function budgetReducer(state = initialState.budget, action) {
	switch (action.type) {
		case types.GET_BUDGET_CATEGORIES_SUCCESS:
			return {
				...state,
				categoryGroups: action.categoryGroups
			};
		case types.GET_BUDGET_ACCOUNTS_SUCCESS:
			return {
				...state,
				accounts: action.accounts,
				netWorth: action.accounts
					.filter(account => (account.on_budget || account.type === 'otherAsset' || account.type === "otherLiability") &&
						!account.closed && account.balance !== 0)
					.reduce((sum, account) => {
						return sum + account.balance / 1000;
					}, 0)
			};
		case types.GET_BUDGET_CURRENT_MONTH_SUCCESS:
			return {
				...state,
				currentMonth: action.month
			};
		default:
			return state;
	}
}