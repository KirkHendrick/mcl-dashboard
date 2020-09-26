import types from "../common/actionTypes";

export function connectToWebSocket() {
	return function (dispatch) {
		dispatch({type: types.WS_CONNECT});
	}
}