import types from '../common/actionTypes';
import initialState from "../common/initialState";
import { formattedRecord, dateFormatted, weekNumber } from "../../common/utils";

export default function pomodoroReducer(state = initialState.pomodoros, action) {
	switch (action.type) {
		case types.GET_ENTIRE_ARCHIVE_SUCCESS:
			let pomodoroArchive = action.archive.Pomodoros.map(formattedRecord);

			let pomodorosThisWeek = pomodoroArchive
				.filter(pomodoro => {
					return weekNumber(pomodoro.Date) === weekNumber();
				}).filter(pomodoro => {
					return pomodoro.Date !== dateFormatted() &&
						(new Date(pomodoro.Date).getFullYear() === new Date().getFullYear());
				});

			return {
				...state,
				archive: pomodoroArchive,
				thisWeek: pomodorosThisWeek
			};
		case types.CURRENT_POMODORO_TIME_SENT:
			return {
				...state,
				currentTime: action.timeLeft,
				active: action.active
			}
		case types.POMODORO_TIMER_STARTED:
			return {
				...state,
				active: action.active
			}
		case types.POMODORO_TIMER_STOPPED:
			return {
				...state,
				currentTime: action.timeLeft,
				running: action.running
			}
		case types.GET_TODAYS_POMODOROS_SUCCESS:
			return {
				...state,
				today: action.pomodoros
			};
		case types.GET_YESTERDAYS_POMODOROS_SUCCESS:
			return {
				...state,
				yesterday: action.pomodoros
			};
		case types.GET_POMODORO_ARCHIVE_SUCCESS:
			return {
				...state,
				archive: action.pomodoros
			};
		case types.GET_ACTIVE_POMODORO_SUCCESS:
			return {
				...state,
				activePomodoro: action.activePomodoro
			};
		case types.INCREMENT_ACTIVE_POMODORO_SUCCESS:
			return {
				...state,
				activePomodoro: action.activePomodoro,
				today: state.today.map(pomodoro => {
					if (pomodoro.id === action.activePomodoro.id) {
						return action.activePomodoro;
					}
					return pomodoro;
				})
			};
		default:
			return state;
	}
}
