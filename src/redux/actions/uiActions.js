import types from '../common/actionTypes';

export function closeModal() {
	return function (dispatch) {
		dispatch({type: types.CLOSE_MODAL});
	}
}

export function openPopover(markup) {
	return function (dispatch) {
		dispatch({type: types.OPEN_POPOVER, markup});
	}
}

export function closePopover() {
	return function (dispatch) {
		dispatch({type: types.CLOSE_POPOVER});
	}
}
