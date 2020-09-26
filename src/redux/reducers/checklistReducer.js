import types from '../common/actionTypes';
import initialState from "../common/initialState";

export default function checklistReducer(state = initialState.checklists, action) {
	switch (action.type) {
		case types.GET_MORNING_CHECKLIST_SUCCESS:
			return action.checklists;
		case types.COMPLETE_MORNING_CHECKLIST_ITEM:
			return state.map(checklist => {
				let _checklist = {...checklist};
				if (checklist.name === action.checklist.name) {
					_checklist.items = checklist.items.map(item => {
						let _item = {...item};
						if (item.label === action.item.label) {
							_item.checked = !item.checked;
						}
						return _item;
					});
				}
				return _checklist;
			});
		default:
			return state;
	}
}
