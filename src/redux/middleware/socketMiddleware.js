import types from "../common/actionTypes";
import socketApi from "../../api/socketApi";

export const createSocketMiddleware = () => {
	let socket = null;

	return store => next => action => {
		switch (action.type) {

			case types.WS_CONNECT:
				if(socket !== null) {
					socket.close();
				}

				socket = socketApi.createSocket();

				socket.onopen = (event) => {
					console.log('websocket open:', event.target.url);
					store.dispatch({ type: types.WS_CONNECTED, connected: true})
				}

				socket.onclose = () => {
					store.dispatch({type: types.WS_DISCONNECTED, connected: false});
				}

				socket.onmessage = (event) => {
					const action = socketApi.handleMessageFromSocket(event.data, socket);
					if(action) {
						store.dispatch(action);
					}
				}

				break;

			case types.WS_DISCONNECT:
				if(socket !== null) {
					socket.close();
				}
				socket = null;
				console.log('websocket closed');
				break;
			default:
				socketApi.sendActionToSocket(action, store, socket);
				return next(action);
		}
	}
};