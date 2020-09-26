import types from '../common/actionTypes';
import dashboardApi from "../../api/dashboardApi";
import { apiCallError, beginApiCall } from "./apiStatusActions";
import { formattedRecord } from "../../common/utils";

export function getNotesSuccess(notes) {
	return {type: types.GET_NOTES_SUCCESS, notes};
}

export function getNotes(coreFour) {
	return function (dispatch) {
		dispatch(beginApiCall());
		return dashboardApi.get(funcMap[coreFour])
			.then(notes => {
				dispatch(getNotesSuccess(notes.map(formattedRecord)));
			})
			.catch(error => {
				dispatch(apiCallError(error));
				console.warn(error);
				throw error;
			});
	}
}

const funcMap = {
	'Me, Inc.': 'me_inc_notes'
};