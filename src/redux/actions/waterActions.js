import types from '../common/actionTypes';

export function logWater() {
	return function (dispatch) {
		dispatch({type: types.LOG_WATER});
	}
}

export function getTodaysWater() {
	return function (dispatch) {
		dispatch({type: types.GET_TODAYS_WATER});
	}
}
