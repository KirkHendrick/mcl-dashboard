import types from '../common/actionTypes';
import initialState from "../common/initialState";

export default function websocketReducer(state = initialState.socketConnection, action) {
	switch (action.type) {
		case types.WS_CONNECTED:
			return {
				...state,
				connected: action.connected
			};
		case types.WS_DISCONNECTED:
			return {
				...state,
				connected: action.connected
			};
		default:
			return state;
	}
}