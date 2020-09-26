import types from '../common/actionTypes';
import initialState from "../common/initialState";

export default function widgetReducer(state = initialState.widgets, action) {
	switch (action.type) {
		case types.GET_WIDGETS_SUCCESS:
			return action.widgets;
		case types.CREATE_WIDGET:
			return state.concat([action.widget]);
		default:
			return state;
	}
}