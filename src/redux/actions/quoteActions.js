import types from '../common/actionTypes';

export function getRandomQuote() {
	return function (dispatch) {
		dispatch({type: types.GET_RANDOM_QUOTE});
	}
}
