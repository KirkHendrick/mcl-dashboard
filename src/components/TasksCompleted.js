import React, { useEffect } from "react";
import { connect } from 'react-redux';
import BigNumber from "./BigNumber";
import { getTodaysTasks } from '../redux/actions/taskActions';

function TasksCompleted({getTodaysTasks, tasks, ...props}) {
	useEffect(() => {
		getTodaysTasks();
	}, [getTodaysTasks]);

	return (
		<BigNumber number={tasks} color={'var(--muted-purple)'} />
	);
}

function mapStateToProps(state, ownProps) {
	return {
	tasks: state.tasks.today.reduce((sum, task) => {
			if(task.Status === 'Done') {
				sum += 1;
			}

			return sum;
		}, 0)
	};
}

const mapDispatchToProps = {
	getTodaysTasks
};


export default connect(mapStateToProps, mapDispatchToProps)(TasksCompleted);