import types from '../common/actionTypes';

export function getYesterdaysMeals() {
	return function (dispatch) {
		dispatch({type: types.GET_YESTERDAYS_MEALS});
	}
}

export function getTodaysMeals() {
	return function (dispatch) {
		dispatch({type: types.GET_TODAYS_MEALS});
	}
}

export function logMeal(meal) {
	return function (dispatch) {
		dispatch({type: types.LOG_MEAL, meal});
	}
}
