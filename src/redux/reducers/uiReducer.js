import types from '../common/actionTypes';
import initialState from "../common/initialState";

export default function uiReducer(state = initialState.ui, action) {
	switch (action.type) {
		case types.OPEN_POPOVER:
			debugger;
			return {
				...state,
				popover: {
					...state.popover,
					markup: action.markup,
					shown: true
				}
			};
		case types.CLOSE_POPOVER:
			return {
				...state,
				popover: {
					...state.popover,
					shown: false
				}
			};
		default:
			return state;
	}
}