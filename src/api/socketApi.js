import types from "../redux/common/actionTypes";
import { formattedRecord } from "../common/utils";
import secrets from "../secrets/secrets";

const socketApi = {
	sendActionToSocket,
	handleMessageFromSocket,
	createSocket
};

const url = `ws://${secrets.PUBLIC_IP}:9000/ws`;

function createSocket() {
	return new WebSocket(url);
}

function sendActionToSocket(action, store, socket) {
	let connected = store.getState().socketConnection.connected;

	if (connected) {
		switch (action.type) {
			case types.START_POMODORO_TIMER:
				socket.send(getAction(types.START_POMODORO_TIMER));
				break;

			case types.STOP_POMODORO_TIMER:
				socket.send(getAction(types.STOP_POMODORO_TIMER));
				break;

			case types.GET_POINT_RULES:
				socket.send(getAction(types.GET_POINT_RULES));
				break;

			case types.GET_TODAYS_WATER:
				socket.send(getAction(types.GET_TODAYS_WATER));
				break;

			case types.LOG_WATER:
				socket.send(getAction(types.LOG_WATER));
				break;

			case types.GET_TODAYS_HEALTH_BAR:
				socket.send(getAction(types.GET_TODAYS_HEALTH_BAR));
				break;

			case types.GET_TODAYS_ACTIVE_MINUTES:
				socket.send(getAction(types.GET_TODAYS_ACTIVE_MINUTES));
				break;

			case types.LOG_COMPULSION:
				socket.send(getAction(types.LOG_COMPULSION));
				break;

			case types.CREATE_REPEATING_RECORDS:
				socket.send(getAction(types.CREATE_REPEATING_RECORDS));
				break;

			case types.GET_PAGES:
				socket.send(getAction(types.GET_PAGES));
				break;

			case types.GET_WIDGETS:
				socket.send(getAction(types.GET_WIDGETS));
				break;

			case types.GET_RANDOM_QUOTE:
				socket.send(getAction(types.GET_RANDOM_QUOTE));
				break;

			case types.GET_TODAYS_PAST_LOGS:
				socket.send(getAction(types.GET_TODAYS_PAST_LOGS));
				break;

			case types.GET_TODAYS_POMODOROS:
				socket.send(getAction(types.GET_TODAYS_POMODOROS));
				break;

			case types.GET_TODAYS_TASKS:
				socket.send(getAction(types.GET_TODAYS_TASKS));
				break;

			case types.GET_MORNING_CHECKLIST:
				socket.send(getAction(types.GET_MORNING_CHECKLIST));
				break;

			case types.SET_CURRENT_POMODORO_TIME:
				socket.send(getAction(types.SET_CURRENT_POMODORO_TIME, {
					active: {
						'Time Left': store.getState().pomodoros.active['Time Left']
					}
				}));
				break;

			case types.START_AUTO_REFRESH:
				socket.send(getAction(types.START_AUTO_REFRESH));
				break;

			case types.GET_ENTIRE_ARCHIVE:
				socket.send(getAction(types.GET_ENTIRE_ARCHIVE));
				break;

			case types.GET_BUDGET_ACCOUNTS:
				socket.send(getAction(types.GET_BUDGET_ACCOUNTS));
				break;

			case types.GET_BUDGET_CATEGORIES:
				socket.send(getAction(types.GET_BUDGET_CATEGORIES));
				break;

			case types.GET_BUDGET_CURRENT_MONTH:
				socket.send(getAction(types.GET_BUDGET_CURRENT_MONTH));
				break;

			case types.GET_YESTERDAYS_MEALS:
				socket.send(getAction(types.GET_YESTERDAYS_MEALS));
				break;

			case types.GET_TODAYS_MEALS:
				socket.send(getAction(types.GET_TODAYS_MEALS));
				break;

			case types.GET_CONTINUOUS_GOALS:
				socket.send(getAction(types.GET_CONTINUOUS_GOALS));
				break;

			default:
				break;
		}
	} else {
		setTimeout(() => {
			sendActionToSocket(action, store, socket);
		}, 10);
	}

	function getAction(actionType, payload) {
		return JSON.stringify({
			method: actionType.toLowerCase(),
			payload: payload ? payload : null
		});
	}

}

function handleMessageFromSocket(message, socket) {
	const payload = JSON.parse(message);
	console.log(payload);

	switch (payload.type) {
		case types.CURRENT_POMODORO_TIME_SENT:
			return {
				type: payload.type,
				timeLeft: payload.time_left,
				active: formattedRecord(payload.active)
			};
		case types.POMODORO_TIMER_STARTED:
			return {
				type: payload.type,
				timeLeft: payload.time_left,
				running: payload.running,
				active: formattedRecord(payload.active),
			};
		case types.POMODORO_TIMER_STOPPED:
			return {
				type: payload.type,
				timeLeft: payload.time_left,
				running: payload.running
			};
		case types.GET_PAGES_SUCCESS:
			return {
				type: payload.type,
				pages: JSON.parse(payload.pages)
			};
		case types.GET_WIDGETS_SUCCESS:
			return {
				type: payload.type,
				widgets: JSON.parse(payload.widgets)
			};
		case types.GET_RANDOM_QUOTE_SUCCESS:
			return {
				type: payload.type,
				quote: JSON.parse(payload.quote)
			};
		case types.GET_TODAYS_PAST_LOGS_SUCCESS:
			return {
				type: payload.type,
				logs: payload.logs.map(log => {
					return {...log, lines: log.text.split('\n\n')};
				})
			};
		case types.GET_TODAYS_POMODOROS_SUCCESS:
			return {
				type: payload.type,
				pomodoros: payload.pomodoros.map(formattedRecord)
			};
		case types.GET_POINT_RULES_SUCCESS:
			return {
				type: payload.type,
				pointRules: payload.pointRules.map(formattedRecord)
			};
		case types.GET_TODAYS_ACTIVE_MINUTES_SUCCESS:
			return {
				type: payload.type,
				activeMinutes: payload.activeMinutes.map(formattedRecord)
			};
		case types.CREATE_REPEATING_RECORDS_SUCCESS:
			return {
				type: payload.type,
			};
		case types.GET_TODAYS_HEALTH_BAR_SUCCESS:
			return {
				type: payload.type,
				healthBar: payload.healthBar
			};
		case types.GET_TODAYS_WATER_SUCCESS:
			return {
				type: payload.type,
				waterLog: formattedRecord(payload.waterLog)
			};
		case types.GET_ENTIRE_ARCHIVE_SUCCESS:
			return {
				type: payload.type,
				archive: payload.archive
			};
		case types.GET_MORNING_CHECKLIST_SUCCESS:
			return {
				type: payload.type,
				checklists: payload.checklists
			};
		case types.GET_TODAYS_TASKS_SUCCESS:
			return {
				type: payload.type,
				tasks: payload.tasks.map(formattedRecord)
			};
		case types.GET_BUDGET_CATEGORIES_SUCCESS:
			return {
				type: payload.type,
				categoryGroups: payload.category_groups
			};
		case types.GET_BUDGET_ACCOUNTS_SUCCESS:
			return {
				type: payload.type,
				accounts: payload.accounts
			};
		case types.GET_BUDGET_CURRENT_MONTH_SUCCESS:
			return {
				type: payload.type,
				month: payload.month
			};
		case types.GET_YESTERDAYS_MEALS_SUCCESS:
			return {
				type: payload.type,
				meals: payload.meals.map(formattedRecord)
			};
		case types.GET_TODAYS_MEALS_SUCCESS:
			return {
				type: payload.type,
				meals: payload.meals.map(formattedRecord)
			};
		case types.GET_CONTINUOUS_GOALS_SUCCESS:
			return {
				type: payload.type,
				goals: JSON.parse(payload.goals)
			};
		default:
			break;
	}
}

export default socketApi;