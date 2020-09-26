import types from '../common/actionTypes';
import initialState from "../common/initialState";
import { dateFormatted, formattedRecord, weekNumber } from "../../common/utils";

export default function _Reducer(state = initialState.water, action) {
	switch (action.type) {
		case types.GET_ENTIRE_ARCHIVE_SUCCESS:
			let waterArchive = action.archive.Water.map(formattedRecord);

			let waterThisWeek = waterArchive
				.filter(record => {
					return weekNumber(record.Date) === weekNumber();
				}).filter(record => {
					return (dateFormatted(record.Date) !== dateFormatted()) &&
						(new Date(record.Date).getFullYear() === new Date().getFullYear());
				});

			return {
				...state,
				archive: waterArchive,
				thisWeek: waterThisWeek
			};
		case types.GET_TODAYS_WATER_SUCCESS:
			return {
				...state,
				today: action.waterLog ? action.waterLog.Number : 0
			};
		default:
			return state;
	}
}