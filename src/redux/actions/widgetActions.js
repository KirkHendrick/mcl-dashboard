import types from '../common/actionTypes';

export function getWidgets() {
	return function (dispatch) {
		dispatch({type: types.GET_WIDGETS});
	}
}

export function createWidget(widget, page) {
	return function (dispatch) {
		dispatch({type: types.CREATE_WIDGET, widget, page});
	}
}

export function openWidgetInModal(widget) {
	return function (dispatch) {
		dispatch({type: types.OPEN_WIDGET_IN_MODAL, widget});
	}
}
