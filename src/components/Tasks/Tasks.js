import React, { useEffect } from "react";
import './Tasks.css'
import { connect } from 'react-redux';
import { getTasks } from '../../redux/actions/taskActions';
import errorLogger from "../../common/errorLogger";
import Spinner from "../../common/Spinner";

const coreFour = 'Me, Inc.';
function Tasks({getTasks, tasks, ...props}) {
	useEffect(() => {
		getTasks(coreFour).catch(errorLogger);

	}, [getTasks]);

	return (
		<div className='generic-tasks-container'>
			{props.loading ? <Spinner/> :
				tasks.length && tasks.map(task =>
					<div key={task.Task}
					     onClick={() => {
					     }}
					     className='task'>
						- {task.Task}
					</div>
				)
			}
		</div>
	);
}

function mapStateToProps(state, ownProps) {
	const category = ownProps.page['Category Name'][0];

	return {
		tasks: !state.tasks[coreFour] || !state.tasks[coreFour].length ? [] : state.tasks[coreFour].filter(task => {
			return category === task['Category Name'][0];
		}),
		loading: state.apiCallsInProgress > 0
	};
}

const mapDispatchToProps = {
	getTasks
};


export default connect(mapStateToProps, mapDispatchToProps)(Tasks);