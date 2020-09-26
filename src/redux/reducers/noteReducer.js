import types from '../common/actionTypes';
import initialState from "../common/initialState";

export default function noteReducer(state = initialState.notes, action) {
	switch (action.type) {
		case types.GET_NOTES_SUCCESS:
			return action.notes;
		default:
			return state;
	}
}