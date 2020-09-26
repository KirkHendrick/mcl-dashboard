import types from '../common/actionTypes';

export function logCompulsion() {
	return function (dispatch) {
		dispatch({type: types.LOG_COMPULSION});
	}
}