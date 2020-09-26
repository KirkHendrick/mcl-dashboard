import React, { useEffect, useState } from "react";
import { connect } from 'react-redux';
import styled from "styled-components";
import { getEntireArchive } from "../redux/actions/archiveActions";
import { getTodaysPomodoros } from "../redux/actions/pomodoroActions";
import { getTodaysTasks } from "../redux/actions/taskActions";
import { getTodaysWater } from "../redux/actions/waterActions";
import { getPointRules } from "../redux/actions/pointActions";
import { getTodaysActiveMinutes } from "../redux/actions/healthActions";
import { openPopover, closePopover } from "../redux/actions/uiActions";

const EXPONENT = 1.3;
const BASE_XP = 1000;

function LevelBar(
	{
		pomodoros, tasks, water, connected, points, health,
		getEntireArchive, getTodaysTasks, getTodaysPomodoros, getTodaysWater,
		getTodaysActiveMinutes, getPointRules, openPopover, closePopover,
		...props
	}) {
	const [displayedPoints, setDisplayedPoints] = useState(0);
	const [totalPoints, setTotalPoints] = useState(0);
	const [total, setTotal] = useState(0);
	const [level, setLevel] = useState(1);
	const [levelMap, setLevelMap] = useState({});

	const [numPomodorosToday, setNumPomodorosToday] = useState(0);
	const [numPomodorosThisWeek, setNumPomodorosThisWeek] = useState(0);
	const [numCompletedTasksToday, setNumCompletedTasksToday] = useState(0);
	const [numCompletedTasksThisWeek, setNumCompletedTasksThisWeek] = useState(0);
	const [numWaterThisWeek, setNumWaterThisWeek] = useState(0);
	const [numActiveMinutesToday, setNumActiveMinutesToday] = useState(0);

	const [pointSources, setPointSources] = useState([]);

	useEffect(() => {
		let levels = {};
		for (let i = 0; i < 1000; i++) {
			levels[i] = nextLevel(i);
		}
		setLevelMap(levels);
	}, []);

	useEffect(() => {
		if (connected) {
			getPointRules();
			getTodaysTasks();
			getTodaysPomodoros();
			getTodaysWater();
			getEntireArchive();
			getTodaysActiveMinutes();
		}
	}, [getTodaysPomodoros, getTodaysTasks,
		getEntireArchive, connected, getTodaysWater,
		getPointRules, getTodaysActiveMinutes,
	]);

	useEffect(() => {
		setNumPomodorosToday(pomodoros.today.reduce(pomodoroSum, 0));
	}, [pomodoros.today]);

	useEffect(() => {
		setNumActiveMinutesToday(health.today.activeMinutes);
	}, [health.today.activeMinutes]);

	useEffect(() => {
		setNumCompletedTasksToday(tasks.today.filter(taskDoneFilter).length);
	}, [tasks.today]);

	useEffect(() => {
		setNumPomodorosThisWeek(pomodoros.thisWeek.reduce(pomodoroSum, 0));
	}, [pomodoros.thisWeek]);

	useEffect(() => {
		setNumCompletedTasksThisWeek(tasks.thisWeek.filter(taskDoneFilter).length);
	}, [tasks.thisWeek]);

	useEffect(() => {
		setNumWaterThisWeek(water.thisWeek.reduce((sum, records) => {
			sum += Number(records.Number);
			return sum;
		}, 0));
	}, [water.thisWeek]);

	useEffect(() => {
		if (points.rules.length) {
			let sources = [
				{source: numPomodorosToday, label: 'Pomodoros Today', rule: 'Complete Pomodoros'},
				{source: numPomodorosThisWeek, label: 'Pomodoros This Week', rule: 'Complete Pomodoros'},
				{source: numCompletedTasksToday, label: 'Tasks Today', rule: 'Complete Tasks'},
				{source: numCompletedTasksThisWeek, label: 'Tasks This Week', rule: 'Complete Tasks'},
				{source: numWaterThisWeek, label: 'Water This Week', rule: 'Drink Water'},
				{source: water.today, label: 'Water Today', rule: 'Drink Water'},
				{source: numActiveMinutesToday, label: 'Active Minutes', rule: 'Activity'},
			];

			let xp = sources.reduce((sum, pointSource) => {
				console.log(pointSource);
				points.rules.forEach(pointRule => {
					if (pointRule.Name === pointSource.rule) {
						sum += Number(pointSource.source) * pointRule.Points;
					}
				})
				return sum;
			}, 0);

			setTotalPoints(xp);
			setPointSources(sources);
		}
	}, [
		numPomodorosToday, numPomodorosThisWeek,
		numCompletedTasksToday, numCompletedTasksThisWeek,
		water.today, numWaterThisWeek, points.rules, numActiveMinutesToday
	]);

	useEffect(() => {
		if (levelMap[1]) {
			let [newLevel, points] = increaseLevel(level, totalPoints);
			setLevel(newLevel);
			setDisplayedPoints(points);
		}

		function increaseLevel(originalLevel, originalPoints) {
			if (originalPoints > levelMap[originalLevel]) {
				let displayed = Number(originalPoints - levelMap[originalLevel]);
				return increaseLevel(originalLevel + 1, displayed);
			}
			return [originalLevel, originalPoints - levelMap[originalLevel - 1]];
		}
		//eslint-disable-next-line
	}, [level, totalPoints]);

	useEffect(() => {
		if (levelMap[1] && displayedPoints > 0) {
			setTotal(levelMap[level] - levelMap[level - 1]);
		}
	}, [level, displayedPoints, levelMap]);

	return (
		<Container>
			<LevelText>
				<LevelName>
					Level {level}
				</LevelName>
				{displayedPoints && total ?
					<div title={
						formatted(displayedPoints) + ' / ' +
						formatted(total)
					}>
						{formatted(total - displayedPoints) + ' '}xp left
					</div> : <></>
				}
			</LevelText>
			<Bars>
				<FillerBar size={displayedPoints / total} title={`${displayedPoints} out of ${total}`}
				           onClick={() => {
				           	openPopover(<>
					            {pointSources.map(source => {
						            return <div>{`${source.label} : ${source.source}`}</div>
					            })}
				            </>)
				           }}
				>
				</FillerBar>
				<TotalBar size={(total - displayedPoints) / total} total={total}>
				</TotalBar>
			</Bars>
		</Container>
	);

	function nextLevel(level) {
		return Math.floor(BASE_XP * (Math.pow(level, EXPONENT)));
	}

	function pomodoroSum(sum, p) {
		sum += Number(p.Number);
		return sum;
	}

	function taskDoneFilter(task) {
		return task.Status === 'Done'
	}

	function formatted(num) {
		return Math.floor(num).toLocaleString();
	}
}

const Container = styled.div`
	width: 90%;
	padding-left: 1rem;
	padding-top: 2rem;
`;

const LevelText = styled.div`
	color: var(--muted-purple);
	font-size: 1.1rem;	
	padding-left: .25rem;
	padding-bottom: .5rem;
	
	display: flex;
	justify-content: space-between;
`;

const LevelName = styled.div`
`;

const Bars = styled.div`
	display: flex;
	position: relative;
`;

const TotalBar = styled.div`
	z-index: 100;
	position: absolute;
	width: 100%;
	background-color: #1e1f1e;	
	border: .2rem solid #1e1f1e;
	height: 2rem;
`;

const FillerBar = styled.div`
	width: ${props => props.size >= 1 ? 100 : props.size * 100}%;
	height: 2rem;
	background-clip: padding-box;
	margin-top: .2rem;
	margin-left: .2rem;
	z-index: 101;
	position: absolute;
	background-color: #7b92ad;
	transition: width .7s ease-in-out;
	border-radius: 1px;
	cursor: pointer;
`;

function mapStateToProps(state, ownProps) {
	return {
		pomodoros: state.pomodoros,
		tasks: state.tasks,
		water: state.water,
		connected: state.socketConnection.connected,
		points: state.points,
		health: state.health
	};
}

const mapDispatchToProps = {
	getEntireArchive, getTodaysTasks, getTodaysPomodoros,
	getTodaysWater, getPointRules, getTodaysActiveMinutes,
	openPopover, closePopover
};


export default connect(mapStateToProps, mapDispatchToProps)(LevelBar);