import React, { useEffect } from "react";
import { connect } from 'react-redux';
import { getTodaysPastLogs } from "../../redux/actions/logActions";
import './TodayInHistory.css'

function TodayInHistory({getTodaysPastLogs, logs, ...props}) {
	useEffect(() => {
		if (!logs.length) {
			getTodaysPastLogs();
		}
	}, [logs, getTodaysPastLogs]);

	return (
		<div className='logs-container'>
			{logs.length && logs.map(log => {
				return <div key={log.year} className='log'>
					<div className='log-name'>{log.year}</div>
					<div className='lines-container'>
						{log.lines.map(line => {
							return <div key={line} className='line'>{line}</div>
						})}
					</div>
				</div>
			})}
		</div>
	);
}

function mapStateToProps(state, ownProps) {
	return {
		logs: state.logs
	};
}

const mapDispatchToProps = {
	getTodaysPastLogs
};

export default connect(mapStateToProps, mapDispatchToProps)(TodayInHistory);
