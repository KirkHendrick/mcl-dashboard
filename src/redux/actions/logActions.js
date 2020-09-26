import types from '../common/actionTypes';

export function getTodaysPastLogs() {
	return function (dispatch) {
		dispatch({type: types.GET_TODAYS_PAST_LOGS});
	}
}
