import types from '../common/actionTypes';
import initialState from "../common/initialState";

export default function goalReducer(state = initialState.goals, action) {
	switch (action.type) {
		case types.GET_CONTINUOUS_GOALS_SUCCESS:
			return action.goals;
		default:
			return state;
	}
}