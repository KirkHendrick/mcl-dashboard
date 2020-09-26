import moment from "moment";

export function arrayOfLength(num) {
	return Array.from(Array(num).keys());
}

export function formattedRecord(record) {
	if (record) {
		let newRecord = Object.assign({}, record.fields);
		newRecord.id = record.id;
		return newRecord;
	}
	return {}
}

export function dateFormatted(date) {
	let dateToFormat;
	if(date) {
		dateToFormat = new Date(date);
	}
	else {
		dateToFormat = new Date();
	}

	return dateToFormat.toISOString().slice(0,10);
}

export function dayDiff(startDate, endDate) {
	const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
	return Math.round(Math.abs((startDate - endDate) / oneDay));
}

export function weekNumber(date) {
	let d;

	if(date) {
		d = new Date(date);
	}
	else {
		d = new Date();
	}
	return moment(d).week();
}


export function refresh(props, fn) {
	if (props) {
		const config = JSON.parse(props);
		if (config && config.refreshRate) {
			return setInterval(() => {
				if (fn) {
					fn();
				}
			}, config.refreshRate * 1000);
		}
	}
}