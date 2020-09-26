import types from '../common/actionTypes';

export function getMorningChecklist() {
	return function (dispatch) {
		dispatch({type: types.GET_MORNING_CHECKLIST});
	}
}

export function completeMorningChecklistItem(checklist, item) {
	return function (dispatch) {
		dispatch({type: types.COMPLETE_MORNING_CHECKLIST_ITEM, checklist, item});
	}
}
