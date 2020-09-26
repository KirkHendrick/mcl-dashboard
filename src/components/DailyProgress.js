import React, { useEffect } from "react";
import { connect } from 'react-redux';
import { getContinuousGoals } from "../redux/actions/goalActions";
import { getTodaysPomodoros } from "../redux/actions/pomodoroActions";
import { getTodaysTasks } from "../redux/actions/taskActions";
import { getTodaysActiveMinutes} from "../redux/actions/healthActions";
import { getTodaysMeals} from "../redux/actions/foodActions";
import styled from 'styled-components';
import ProgressBar from "./ProgressBar";

function DailyProgress(
	{
		getContinuousGoals, getTodaysPomodoros, getTodaysTasks,
		getTodaysActiveMinutes, getTodaysMeals,
		goals, pomodoros, tasks, water, health, food,
		...props
	}) {
	useEffect(() => {
		getContinuousGoals();
		getTodaysPomodoros();
		getTodaysTasks();
		getTodaysActiveMinutes();
		getTodaysMeals();
	}, [getContinuousGoals, getTodaysPomodoros, getTodaysTasks, getTodaysActiveMinutes, getTodaysMeals]);

	const methods = {
		dailyPomodoroSum: () => {
			return pomodoros.today.reduce((sum, pomodoro) => {
				sum += Number(pomodoro.Number);
				return sum;
			}, 0)
		},
		dailyAcumenPomodoroSum: () => {
			return pomodoros.today.filter(pomodoro => {
				if(pomodoro['Parent Category']) {
					// TODO: move these category ids to central map, or reference archive
					return pomodoro['Parent Category'][0] === 'recGO5A8qtB2ryjhJ';
				}
				return false;
			}).reduce((sum, pomodoro) => {
				sum += Number(pomodoro.Number);
				return sum;
			}, 0)
		},
		dailyBusinessTasksSum: () => {
			return tasks.today.filter(task => (task.Status === 'Done' || task.Status === 'N/A') && (task['Core Four'] === 'Me' +
				' Inc.')).length;
		},
		dailyTasksSum: () => {
			return tasks.today.filter(task => task.Status === 'Done' || task.Status === 'N/A').length;
		},
		dailyWater: () => {
			return water.today;
		},
		totalTasks: () => {
			return tasks.today.length;
		},
		totalBusinessTasks: () => {
			return tasks.today.filter(task => task['Core Four'] === 'Me Inc.').length;
		},
		dailyActiveMinutes: () => {
			return health.today.activeMinutes;
		},
		mealsLogged: () => {
			return food.today.meals.length;
		}
	};

	return (
		<Container>
			{goals.filter(goal => goal.Continuity === 'Daily').map(goal => {
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
		pomodoros: state.pomodoros,
		tasks: state.tasks,
		water: state.water,
		health: state.health,
		food: state.food
	};
}

const mapDispatchToProps = {
	getContinuousGoals, getTodaysPomodoros, getTodaysTasks, getTodaysActiveMinutes, getTodaysMeals
}


export default connect(mapStateToProps, mapDispatchToProps)(DailyProgress);