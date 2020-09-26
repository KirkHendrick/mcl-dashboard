import types from '../common/actionTypes';
import initialState from "../common/initialState";

export default function messageReducer(state = initialState.messages, action) {
	switch (action.type) {
		case types.API_CALL_ERROR:
			return { ...state, errors: [...state.errors, action.error]};
		default:
			return state;
	}
}
