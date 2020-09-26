import React, { useEffect } from "react";
import { connect } from "react-redux";
import { getTodaysPomodoros, getYesterdaysPomodoros } from "../redux/actions/pomodoroActions";
import BigNumber from "./BigNumber";

function TodaysPomodoros({today, yesterday, pomodoros, getTodaysPomodoros, getYesterdaysPomodoros, refresh, ...props}) {
	useEffect(() => {
		getTodaysPomodoros();
	}, [getTodaysPomodoros, getYesterdaysPomodoros]);

	return (
		<BigNumber number={today}/>
	);
}

function mapStateToProps(state, ownProps) {
	return {
		today: state.pomodoros.today.reduce(sumPomodoros, 0),
		yesterday: state.pomodoros.yesterday.reduce(sumPomodoros, 0),
		pomodoros: state.pomodoros.today
	};

	function sumPomodoros(totalPoms, pomodoro) {
		return totalPoms + (Number(pomodoro.Number) || 0);
	}
}

const mapDispatchToProps = {
	getTodaysPomodoros, getYesterdaysPomodoros
};

export default connect(mapStateToProps, mapDispatchToProps)(TodaysPomodoros);