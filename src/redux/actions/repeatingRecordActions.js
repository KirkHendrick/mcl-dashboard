import types from '../common/actionTypes';

export function createRepeatingRecords() {
	return function (dispatch) {
		dispatch({type: types.CREATE_REPEATING_RECORDS});
	}
}