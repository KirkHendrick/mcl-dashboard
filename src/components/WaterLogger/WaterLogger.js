import React, { useEffect, useState } from "react";
import { connect } from 'react-redux';
import styled from 'styled-components';
import { getTodaysWater, logWater } from "../../redux/actions/waterActions";
import { ReactComponent as WaterIcon } from '../../resources/blue-mana.svg';

function WaterLogger(
	{
		getTodaysWater, water, logWater,
		...props
	}) {
	const [displayedWater, setDisplayedWater] = useState(0);

	useEffect(() => {
		getTodaysWater();
	}, [getTodaysWater]);

	useEffect(() => {
		setDisplayedWater(water);
	}, [water]);

	return (
		<Container>
			<WaterIconContainer onClick={() => log()}>
				<WaterIcon />
			</WaterIconContainer>
		</Container>
	);

	function log() {
		setDisplayedWater(displayedWater + 1);
		logWater();
	}
}

const Container = styled.div`
	height: 100%;
	background-color: #aae0fa;
	color: black;
	border-radius: 20px;
`;

const WaterIconContainer = styled.div`
	transform: scale(0.8);
	cursor: pointer;
	height: 0;

	&:hover {
		transform: scale(0.8);	
	}
`;

function mapStateToProps(state, ownProps) {
	return {
		water: state.water.today,
	};
}

const mapDispatchToProps = {
	getTodaysWater, logWater
}


export default connect(mapStateToProps, mapDispatchToProps)(WaterLogger);
