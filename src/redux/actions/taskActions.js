import types from '../common/actionTypes';
import dashboardApi from "../../api/dashboardApi";
import { apiCallError, beginApiCall } from "./apiStatusActions";
import { formattedRecord } from "../../common/utils";

export function getTasksSuccess(tasks, coreFour) {
	return {type: types.GET_TASKS_SUCCESS, tasks, coreFour};
}

export function getTasks(coreFour) {
	return function (dispatch) {
		dispatch(beginApiCall());
		return dashboardApi.get(funcMap[coreFour])
			.then(tasks => {
				dispatch(getTasksSuccess(tasks.map(formattedRecord), coreFour));
			})
			.catch(error => {
				dispatch(apiCallError(error));
				console.warn(error);
				throw error;
			});
	}
}

export function getTodaysTasks() {
	return function (dispatch) {
		dispatch({type: types.GET_TODAYS_TASKS});
	}
}

const funcMap = {
	'Me, Inc.': 'me_inc_tasks'
};