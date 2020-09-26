import types from '../common/actionTypes';
import initialState from "../common/initialState";

export default function modalReducer(state = initialState.modal, action) {
	switch (action.type) {
		case types.OPEN_WIDGET_IN_MODAL:
			return {
				...state,
				widget: action.widget,
				shown: true
			};
		case types.CLOSE_MODAL:
			return {
				...state,
				shown: false
			};
		default:
			return state;
	}
}