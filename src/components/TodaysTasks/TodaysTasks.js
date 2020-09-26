import React, { useEffect, useState } from "react";
import './TodaysTasks.css'
import { connect } from 'react-redux';
import { getTodaysTasks } from '../../redux/actions/taskActions';

function TodaysTasks({tasks, getTodaysTasks, refresh, ...props}) {
	const [taskGroups, setTaskGroups] = useState({done: []});
	const [taskGroupList, setTaskGroupList] = useState([]);

	useEffect(() => {
		getTodaysTasks();
	}, [getTodaysTasks]);

	useEffect(() => {
		if (tasks.length) {
			let groupMap =
				tasks.reduce((groupMap, task) => {
					const coreFour = task['Core Four'];

					if (coreFour) {
						if (task.Status === 'Done' || task.Status === 'N/A') {
							groupMap.done.push(task);
						} else if (groupMap[coreFour]) {
							groupMap[coreFour].push(task);
						} else {
							groupMap[coreFour] = [task];
						}
					}

					return groupMap;
				}, {done: []});

			setTaskGroups(groupMap);

			setTaskGroupList(['Me Inc.', 'Self-Mastery', 'Personal Life', 'Hobbies']);
		}

	}, [tasks]);

	return (
		<div className='todays-task-groups-container'>
			{taskGroupList.length ? taskGroupList.filter(coreFour => taskGroups[coreFour]).map(coreFour => {
				return <div className='task-today-group' key={coreFour}>
					<div className='task-today-group-name'>{coreFour}</div>

					{taskGroups[coreFour].length > 0 ? taskGroups[coreFour].map(task => {
						return <div key={task.Task} className='task-today'>
							{task.Task}
							<span className='task-today-category'>{task['First Category'].toLowerCase()}</span>
						</div>
					}) : <></>}

				</div>
			}) : <></>}
			<div className=''>
				{taskGroups.done.length ?
					<>
						<div className='done-header'>done</div>
						{taskGroups.done.map(task => {
							return <div key={task.Task} className='done-task'>
								{task.Task}
							</div>
						})}
					</>
					: <></>}
			</div>
		</div>
	);
}

function mapStateToProps(state, ownProps) {
	return {
		tasks: state.tasks.today
	};
}

const mapDispatchToProps = {
	getTodaysTasks
};


export default connect(mapStateToProps, mapDispatchToProps)(TodaysTasks);