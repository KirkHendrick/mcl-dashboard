import React, { useEffect, useState } from "react";
import './PomodoroTimer.css'
import { connect } from 'react-redux';
import {
	getActivePomodoro, incrementActivePomodoro, setCurrentPomodoroTime,
	startPomodoroTimer, stopPomodoroTimer, getCurrentPomodoroTime
} from '../../redux/actions/pomodoroActions';

const maxTimer = 1500;
// const breakTime = 300;

function PomodoroTimer(
	{
		getActivePomodoro,
		incrementActivePomodoro, startPomodoroTimer,
		currentTime, stopPomodoroTimer, getCurrentPomodoroTime, setCurrentPomodoroTime,
		active, running,
		...props
	}) {
	const [interval, setTimerInterval] = useState();
	const [timer, setTimer] = useState(maxTimer);
	const [betweenPomodoros] = useState(false);

	useEffect(() => {
		getCurrentPomodoroTime();
	}, [getCurrentPomodoroTime]);

	useEffect(() => {
		let timerInterval;
		if(active && active.id && !interval) {
			timerInterval = setInterval(() => {
				let timeLeft;

				if(active['Time Left']) {
					timeLeft = active['Time Left'];
				}
				else {
					timeLeft = timer;
				}

				setTimer((timer) => timeLeft - 1);
				setCurrentPomodoroTime();
			}, 1000);

			setTimerInterval(timerInterval);
		}
		//eslint-disable-next-line
	}, [active, setCurrentPomodoroTime])

	return (
		<div className={`timer-container ${betweenPomodoros ? 'break' : ''}`}>
			<div className='timer'>
				{format(timer)}
				<div className='timer-button-container'>
					<div className='timer-button' onClick={() => toggleTimer()}>
						Start
					</div>
				</div>
			</div>
		</div>
	);

	function toggleTimer() {
		startPomodoroTimer();
	}

	// function incrementPomodoro() {
	// 	if (active&& active.id) {
	// 		incrementActivePomodoro(active).catch(errorLogger);
	// 	}
	// }

	function format(seconds) {
		const format = val => `0${Math.floor(val)}`.slice(-2);
		const minutes = (seconds % 3600) / 60;

		return [minutes, seconds % 60].map(format).join(':');
	}
}

function mapStateToProps(state, ownProps) {
	return {
		active: state.pomodoros.active,
		currentTime: state.pomodoros.currentTime,
		running: state.pomodoros.running
	};
}

const mapDispatchToProps = {
	getActivePomodoro, incrementActivePomodoro,
	startPomodoroTimer, stopPomodoroTimer, getCurrentPomodoroTime, setCurrentPomodoroTime
};


export default connect(mapStateToProps, mapDispatchToProps)(PomodoroTimer);