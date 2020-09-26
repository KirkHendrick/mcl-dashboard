import types from '../common/actionTypes';

export function getTodaysHealth() {
	return function (dispatch) {
		dispatch({type: types.GET_TODAYS_HEALTH_BAR});
	}
}

export function getTodaysActiveMinutes() {
	return function (dispatch) {
		dispatch({type: types.GET_TODAYS_ACTIVE_MINUTES});
	}
}
