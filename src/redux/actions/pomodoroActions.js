import types from '../common/actionTypes';
import dashboardApi from "../../api/dashboardApi";
import { apiCallError, beginApiCall } from "./apiStatusActions";
import { formattedRecord } from "../../common/utils";

export function getTodaysPomodorosSuccess(pomodoros) {
	return {type: types.GET_TODAYS_POMODOROS_SUCCESS, pomodoros};
}

export function getYesterdaysPomodorosSuccess(pomodoros) {
	return {type: types.GET_YESTERDAYS_POMODOROS_SUCCESS, pomodoros};
}

export function getPomodoroArchiveSuccess(pomodoros) {
	return {type: types.GET_POMODORO_ARCHIVE_SUCCESS, pomodoros};
}

export function getActivePomodoroSuccess(activePomodoro) {
	return {type: types.GET_ACTIVE_POMODORO_SUCCESS, activePomodoro};
}

export function incrementActivePomodoroSuccess(activePomodoro) {
	return {type: types.INCREMENT_ACTIVE_POMODORO_SUCCESS, activePomodoro};
}

export function startPomodoroTimer() {
	return function (dispatch) {
		dispatch({type: types.START_POMODORO_TIMER});
	}
}

export function stopPomodoroTimer() {
	return function (dispatch) {
		dispatch({type: types.STOP_POMODORO_TIMER});
	}
}

export function getCurrentPomodoroTime() {
	return function (dispatch) {
		dispatch({type: types.GET_CURRENT_POMODORO_TIME});
	}
}

export function setCurrentPomodoroTime() {
	return function (dispatch) {
		dispatch({type: types.SET_CURRENT_POMODORO_TIME});
	}
}

export function getActivePomodoro() {
	return function (dispatch) {
		dispatch({type: types.GET_TODAYS_POMODOROS});
	}
}


export function incrementActivePomodoro() {
	return function (dispatch) {
		dispatch(beginApiCall());
		return dashboardApi.get('increment_active_pomodoro')
			.then(activePomodoro => {
				dispatch(incrementActivePomodoroSuccess(formattedRecord(activePomodoro)));
			})
			.catch(error => {
				dispatch(apiCallError(error));
				console.warn(error);
				throw error;
			});
	}
}

export function getTodaysPomodoros() {
	return function (dispatch) {
		dispatch({type: types.GET_TODAYS_POMODOROS});
	}
}

export function getYesterdaysPomodoros() {
	return function (dispatch) {
		dispatch(beginApiCall());
		return dashboardApi.get('yesterdays_pomodoros')
			.then(pomodoros => {
				dispatch(getYesterdaysPomodorosSuccess(pomodoros.map(formattedRecord)));
			})
			.catch(error => {
				dispatch(apiCallError(error));
				console.warn(error);
				throw error;
			});
	}
}

export function getPomodoroArchive() {
	return function (dispatch) {
		dispatch(beginApiCall());
		return dashboardApi.get('pomodoro_archive')
			.then(pomodoros => {
				dispatch(getPomodoroArchiveSuccess(pomodoros));
			})
			.catch(error => {
				dispatch(apiCallError(error));
				console.warn(error);
				throw error;
			});
	}
}
