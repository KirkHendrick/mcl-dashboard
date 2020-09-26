import types from '../common/actionTypes';
import initialState from "../common/initialState";
import { formattedRecord } from "../../common/utils";

export default function healthReducer(state = initialState.health, action) {
	switch (action.type) {
		case types.GET_TODAYS_HEALTH_BAR_SUCCESS:
			return {
				...state,
				healthBar: formattedRecord(action.healthBar)
			};
		case types.GET_TODAYS_ACTIVE_MINUTES_SUCCESS:
			let minutes = action.activeMinutes
				.reduce((sum, log) => {
					sum += log.Duration;
					return sum;
				}, 0);

			return {
				...state,
				today: {
					...state.today,
					activeMinutes: minutes
				}
			};
		default:
			return state;
	}
}