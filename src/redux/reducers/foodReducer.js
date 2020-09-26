import types from '../common/actionTypes';
import initialState from "../common/initialState";

export default function foodReducer(state = initialState.food, action) {
	switch (action.type) {
		case types.GET_YESTERDAYS_MEALS_SUCCESS:
			return {
				...state,
				meals: state.meals.concat(action.meals)
			};
		case types.GET_TODAYS_MEALS_SUCCESS:
			return {
				...state,
				today: {
					...state.today,
					meals: action.meals
				}
			};
		default:
			return state;
	}
}