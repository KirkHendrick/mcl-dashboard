import types from '../common/actionTypes';

export function startAutoRefresh() {
	return function (dispatch) {
		try {
			dispatch({type: types.START_AUTO_REFRESH});
		} catch (error) {
			console.warn(error);
			throw error;
		}
	}
}

export function stopAutoRefresh() {
	return function (dispatch) {
		try {
			dispatch({type: types.STOP_AUTO_REFRESH});
		} catch (error) {
			console.warn(error);
			throw error;
		}
	}
}
