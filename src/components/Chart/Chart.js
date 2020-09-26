import React, { useEffect, useState } from "react";
import './Chart.css'
import Highcharts from 'highcharts';
import HighchartsReact from "highcharts-react-official";

require("highcharts/themes/dark-unica.js")(Highcharts);

function Chart({widget, ...props}) {
	const [expanded, setExpanded] = useState(props.expanded);

	useEffect(() => {
		setExpanded(props.expanded);
		const timeout = setTimeout(() => {
			window.dispatchEvent(new Event('resize'));
		}, 200);
		return () => clearTimeout(timeout);
	}, [props.expanded]);


	return (
		<div className='chart-container'>
			<div className={'chart-item ' + (expanded ? 'chart-expanded-' + widget['Expanded Size'] : 'chart-contracted-' + widget['Default Size'])}>
				<HighchartsReact highcharts={Highcharts} options={props.options}
				                 oneToOne={true}/>
			</div>
		</div>
	);
}

export default Chart;