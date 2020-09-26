import React from "react";

export default {
	socketConnection: {
		connected: false
	},
	apiCallsInProgress: 0,
	autoRefresh: false,
	pages: [],
	widgets: [],
	logs: [],
	quote: {},
	checklists: [],
	pomodoros: {
		today: [],
		yesterday: [],
		active: {},
		archive: [],
		currentTime: 1500,
		running: false,
		thisWeek: []
	},
	tasks: {
		today: [],
		archive: [],
		thisWeek: []
	},
	messages: {
		errors: []
	},
	notes: [],
	budget: {
		categoryGroups: [],
		currentMonth: {},
		months: [],
		accounts: [],
		netWorth: 0
	},
	weightData: {},
	food: {
		today: {
			meals: []
		},
		meals: []
	},
	water: {
		today: 0,
		thisWeek: []
	},
	ui: {
		modal: {
			shown: false,
			widget: {}
		},
		popover: {
			shown: false,
			markup: <></>
		},
	},
	goals: [],
	archive: {},
	compulsions: [],
	health: {
		healthBar: {},
		today: {
			activeMinutes: 0
		}
	},
	points: {
		rules: []
	},
	repeatingRecords: {
		success: false
	}
}