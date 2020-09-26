import React, { useEffect } from "react";
import { connect } from 'react-redux';
import { getContinuousGoals } from "../redux/actions/goalActions";
import { getEntireArchive } from "../redux/actions/archiveActions";
import { weekNumber } from "../common/utils";
import styled from 'styled-components';
import ProgressBar from "./ProgressBar";

function WeeklyProgress(
	{
		getContinuousGoals, getEntireArchive,
		goals, archive,
		...props
	}) {
	useEffect(() => {
		getContinuousGoals();
		getEntireArchive();
	}, [getContinuousGoals, getEntireArchive]);

	const methods = {
		weeklyPomodoroSum: () => {
			if (archive && archive.Pomodoros) {
				let thisWeeksPomodoros = archive.Pomodoros.filter(record => {
					return (weekNumber(record.Date) === weekNumber()) && new Date(record.Date).getFullYear() === new Date().getFullYear();
				});

				console.log(thisWeeksPomodoros);

				let thisWeeksSum = thisWeeksPomodoros.reduce((sum, pomodoro) => {
					sum += Number(pomodoro.Number);
					return sum;
				}, 0);

				console.log(thisWeeksSum);

				return thisWeeksSum;
			}
		},
	};

	return (
		<Container>
			{goals.filter(goal => goal.Continuity === 'Weekly').map(goal => {
				return <div key={goal.id}>
					{goal.Name}
					<ProgressBar total={goal.totalMethod && methods[goal.totalMethod] instanceof Function ?
						methods[goal.totalMethod]()
						: goal['Goal Number']}
					             completed={goal.completedMethod && methods[goal.completedMethod] instanceof Function ?
						             methods[goal.completedMethod]()
						             : 0}
					             barColor={goal['Bar Color']}
					/>
				</div>
			})}
		</Container>
	);
}

const Container = styled.div`
	padding: 2rem;
`;

function mapStateToProps(state, ownProps) {
	return {
		goals: state.goals,
		archive: state.archive,
	};
}

const mapDispatchToProps = {
	getContinuousGoals, getEntireArchive
}


export default connect(mapStateToProps, mapDispatchToProps)(WeeklyProgress);