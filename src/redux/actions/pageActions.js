import types from '../common/actionTypes';

export function getPages() {
	return function (dispatch) {
		dispatch({type: types.GET_PAGES});
	}
}

export function selectPage(page) {
	return function (dispatch) {
		try {
			return dispatch({type: types.SELECT_PAGE, page});
		}
		catch (error) {
			console.warn(error);
			throw error;
		}
	}
}