import types from '../common/actionTypes';
import initialState from "../common/initialState";

export default function weightReducer(state = initialState.weightData, action) {
	switch (action.type) {
		case types.GET_WEIGHT_DATA_SUCCESS:
			return action.weightData;
		default:
			return state;
	}
}