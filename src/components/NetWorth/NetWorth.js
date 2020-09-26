import React, { useEffect, useState } from "react";
import './NetWorth.css'
import { connect } from 'react-redux';

function NetWorth({netWorth, ...props}) {
	const [displayedNetWorth, setDisplayedNetWorth] = useState(netWorth);

	useEffect(() => {
		if(netWorth) {
			setDisplayedNetWorth(
				Math.round(netWorth).toLocaleString()
			);
		}
	}, [netWorth]);

	return (
		<div className='net-worth-container'>
			<div className='net-worth-number'>
				<span className={netWorth >= 0 ? 'positive' : 'negative'}>
					${displayedNetWorth}
				</span>
			</div>
		</div>
	);
}

function mapStateToProps(state, ownProps) {
	return {
		netWorth: state.budget.netWorth
	};
}

const mapDispatchToProps = {}


export default connect(mapStateToProps, mapDispatchToProps)(NetWorth);