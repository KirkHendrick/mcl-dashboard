import types from '../common/actionTypes';

export function getContinuousGoals() {
	return function (dispatch) {
		dispatch({type: types.GET_CONTINUOUS_GOALS});
	}
}