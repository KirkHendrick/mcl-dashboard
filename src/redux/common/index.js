import { combineReducers } from 'redux';
import logs from '../reducers/logReducer';
import quote from '../reducers/quoteReducer';
import checklists from '../reducers/checklistReducer';
import pomodoros from '../reducers/pomodoroReducer';
import tasks from "../reducers/taskReducer";
import apiCallsInProgress from "../reducers/apiStatusReducer";
import messages from '../reducers/messageReducer';
import notes from '../reducers/noteReducer';
import pages from '../reducers/pageReducer';
import widgets from '../reducers/widgetReducer';
import budget from '../reducers/budgetReducer';
import autoRefresh from '../reducers/refreshReducer';
import weightData from "../reducers/weightReducer";
import socketConnection from "../reducers/websocketReducer";
import food from "../reducers/foodReducer";
import goals from "../reducers/goalReducer";
import water from "../reducers/waterReducer";
import archive from "../reducers/archiveReducer";
import compulsions from "../reducers/compulsionReducer";
import health from "../reducers/healthReducer";
import points from "../reducers/pointReducer";
import ui from "../reducers/uiReducer";
import repeatingRecords from "../reducers/repeatingRecordReducer";

const rootReducer = combineReducers({
	socketConnection, pages, widgets, logs,
	quote, checklists, pomodoros, tasks, autoRefresh,
	apiCallsInProgress, messages, notes, budget, weightData,
	food, goals, water, archive, compulsions, health, points, ui,
	repeatingRecords,
});

export default rootReducer;

// function customCombineReducers(config) {
// 	return (state, action) => {
// 		return Object.keys(config).reduce((state, key) => {
// 			const reducer = config[key];
// 			const previousState = state.get(key);
// 			const newValue = reducer(previousState, action);
// 			if(!newValue) {
// 				throw new Error('No return value from reducer: ' + key);
// 			}
//
// 			return state.set(key, newValue);
// 		});
// 	}
// }