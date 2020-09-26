import types from '../common/actionTypes';
import initialState from "../common/initialState";
import { dateFormatted, formattedRecord, weekNumber } from "../../common/utils";

export default function taskReducer(state = initialState.tasks, action) {
	switch (action.type) {
		case types.GET_ENTIRE_ARCHIVE_SUCCESS:
			let taskArchive = action.archive.Tasks.map(formattedRecord);

			let tasksThisWeek = taskArchive
				.filter(task => {
					let d = task['Completed Date (Formula)'];
					return weekNumber(d) === weekNumber();
				}).filter(task => {
					let d = task['Completed Date (Formula)'];
					return d && (dateFormatted(d) !== dateFormatted()) &&
						(new Date(d).getFullYear() === new Date().getFullYear());
				});

			return {
				...state,
				archive: taskArchive,
				thisWeek: tasksThisWeek
			};
		case types.GET_TASKS_SUCCESS:
			return {
				...state,
				[action.coreFour]: action.tasks
			};
		case types.GET_TODAYS_TASKS_SUCCESS:
			return {
				...state,
				today: action.tasks
			};
		default:
			return state;
	}
}