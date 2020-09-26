import types from '../common/actionTypes';

export function getPointRules() {
	return function (dispatch) {
		dispatch({type: types.GET_POINT_RULES});
	}
}