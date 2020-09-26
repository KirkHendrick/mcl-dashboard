import types from '../common/actionTypes';
import initialState from "../common/initialState";

export default function pointReducer(state = initialState.points, action) {
	switch (action.type) {
		case types.GET_POINT_RULES_SUCCESS:
			return {
				...state,
				rules: action.pointRules
			}
		default:
			return state;
	}
}