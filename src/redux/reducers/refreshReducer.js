import types from '../common/actionTypes';
import initialState from "../common/initialState";

export default function refreshReducer(state = initialState.autoRefresh, action) {
	switch (action.type) {
		case types.START_AUTO_REFRESH:
			return true;
		case types.STOP_AUTO_REFRESH:
			return false;
		default:
			return state;
	}
}