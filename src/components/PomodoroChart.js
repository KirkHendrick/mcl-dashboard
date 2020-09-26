import React, { useEffect, useState } from "react";
import Chart from "./Chart/Chart";
import { connect } from "react-redux";
import { getPomodoroArchive } from "../redux/actions/pomodoroActions";
import errorLogger from "../common/errorLogger";

function PomodoroChart({getPomodoroArchive, pomodoros, ...props}) {
	const [options, setOptions] = useState({
		chart: {
			type: 'line',
			style: {
				fontFamily: "Helvetica"
			},
			backgroundColor: '#353535',
			height: null,
			width: null,
			events: {},
			zoomType: 'x'
		},
		title: {
			text: 'Pomodoros Over Time'
		},
		xAxis: {
			type: 'datetime'
		},
		yAxis: {
			title: {
				text: 'Pomodoros'
			}
		}
	});


	useEffect(() => {
		getPomodoroArchive().catch(errorLogger);
	}, [getPomodoroArchive]);

	useEffect(() => {
		setOptions({
			...options,
			series: [{
				type: 'area',
				name: 'Pomodoros',
				data: pomodoros.map((pomodoro, index) => {
					if(index === 0) return [];
					return [
						Date.parse(pomodoro[0]),
						Number(pomodoro[2])
					];
				})
			}]
		});
		//eslint-disable-next-line
	}, [pomodoros]);

	return (
		<Chart expanded={props.expanded} options={options} widget={props.widget}/>
	);
}

function mapStateToProps(state, ownProps) {
	return {
		pomodoros: state.pomodoros.archive
	};
}

const mapDispatchToProps = {
	getPomodoroArchive
};

export default connect(mapStateToProps, mapDispatchToProps)(PomodoroChart);