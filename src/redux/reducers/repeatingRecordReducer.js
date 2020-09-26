import types from '../common/actionTypes';
import initialState from "../common/initialState";

export default function repeatingRecordReducer(state = initialState.repeatingRecords, action) {
	switch (action.type) {
		case types.CREATE_REPEATING_RECORDS_SUCCESS:
			return {
				...state,
				success: true
			};
		default:
			return state;
	}
}