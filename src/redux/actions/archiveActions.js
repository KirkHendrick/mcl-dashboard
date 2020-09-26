import types from '../common/actionTypes';

export function getEntireArchive() {
	return function (dispatch) {
		dispatch({type: types.GET_ENTIRE_ARCHIVE});
	}
}