import types from '../common/actionTypes';
import initialState from "../common/initialState";

export default function quoteReducer(state = initialState.quote, action) {
	switch (action.type) {
		case types.GET_RANDOM_QUOTE_SUCCESS:
			return action.quote;
		default:
			return state;
	}
}
