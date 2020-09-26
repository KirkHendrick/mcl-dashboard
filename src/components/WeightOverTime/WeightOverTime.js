import React, { useEffect, useState } from "react";
import './WeightOverTime.css'
import { connect } from 'react-redux';
import { getWeightData } from '../../redux/actions/weightActions';
import errorLogger from "../../common/errorLogger";
import Chart from "../Chart/Chart";

function WeightOverTime({getWeightData, weightData, ...props}) {
	const [options, setOptions] = useState({
		chart: {
			type: 'line',
			style: {
				fontFamily: "Helvetica"
			},
			backgroundColor: '#353535',
			height: null,
			width: null,
			zoomType: 'x',
			events: {}
		},
		title: {
			text: 'Weight'
		},
		xAxis: {
			type: 'datetime'
		},
		yAxis: {
			title: {
				text: 'Weight'
			}
		}
	});

	useEffect(() => {
		getWeightData().catch(errorLogger);
	}, [getWeightData]);

	useEffect(() => {
		if(weightData && weightData.length) {
			debugger;
			setOptions({...options,
				series: [{
					type: 'line',
					name: 'Weight',
					data: weightData.map(entry => [
						Date.parse(entry.Date),
						entry.Weight
					])
				}]
			})
		}
	}, [weightData, options]);

	return (
		<div className='weight-chart-container'>
			<Chart expanded={props.expanded} options={options} widget={props.widget}/>
		</div>
);
}

function mapStateToProps(state, ownProps) {
	return {
		weightData: state.weightData
	};
}

const mapDispatchToProps = {
	getWeightData
}


export default connect(mapStateToProps, mapDispatchToProps)(WeightOverTime);