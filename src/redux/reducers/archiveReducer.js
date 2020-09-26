import types from '../common/actionTypes';
import initialState from "../common/initialState";
import { formattedRecord } from "../../common/utils";

export default function archiveReducer(state = initialState.archive, action) {
	switch (action.type) {
		case types.GET_ENTIRE_ARCHIVE_SUCCESS:
			let formattedTables = Object.keys(action.archive).reduce((hash, table) => {
				hash[table] = action.archive[table].map(formattedRecord);
				return hash;
			}, {});

			return {
				...state,
				...formattedTables,
				lastArchive: new Date()
			};
		default:
			return state;
	}
}