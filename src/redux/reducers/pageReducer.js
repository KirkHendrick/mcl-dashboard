import types from '../common/actionTypes';
import initialState from "../common/initialState";
import { createBrowserHistory } from 'history';

export default function pageReducer(state = initialState.pages, action) {
	switch (action.type) {
		case types.GET_PAGES_SUCCESS:
			return action.pages.map(page => {
				const history = createBrowserHistory();
				if (page.Route === history.location.pathname) {
					page.selected = true;
				}

				return page;
			});
		case types.SELECT_PAGE:
			return state.map(page => {
				return {
					...page,
					selected: page.Route === action.page.Route
				};
			});
		case types.CREATE_WIDGET:
			return state.map(page => {
				if (page.id === action.page.id) {
					return {
						...page,
						"Widget Names": page["Widget Names"].concat(action.widget.Name)
					}
				}

				return page;
			});
		default:
			return state;
	}
}