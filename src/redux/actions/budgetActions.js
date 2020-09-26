import types from '../common/actionTypes';

export function getBudgetCategories() {
	return function (dispatch) {
		dispatch({type: types.GET_BUDGET_CATEGORIES});
	}
}

export function getBudgetCurrentMonth() {
	return function (dispatch) {
		dispatch({type: types.GET_BUDGET_CURRENT_MONTH});
	}
}

export function getBudgetAccounts() {
	return function (dispatch) {
		dispatch({type: types.GET_BUDGET_ACCOUNTS});
	}
}
