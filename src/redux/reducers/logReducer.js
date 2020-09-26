import types from '../common/actionTypes';
import initialState from "../common/initialState";

export default function logReducer(state = initialState.logs, action) {
	switch (action.type) {
		case types.GET_TODAYS_PAST_LOGS_SUCCESS:
			return action.logs;
		default:
			return state;
	}
}