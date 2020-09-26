import React, { useEffect } from "react";
import { connect } from 'react-redux';
import styled from 'styled-components';
import ProgressBar from "./ProgressBar";
import { getTodaysHealth } from "../redux/actions/healthActions";

function HealthBar(
	{
		getTodaysHealth,
		healthBar,
		connected,
		...props
	}
) {
	useEffect(() => {
		if (connected) {
			// getTodaysHealth();
		}
	}, [connected, getTodaysHealth]);

	useEffect(() => {
		console.log(healthBar);
	}, [healthBar]);

	return (
		<Container>
			<HealthBarLabel>
				HP
			</HealthBarLabel>
			<HealthBarContainer>
				<ProgressBar completed={healthBar.Earned} total={healthBar['Total Health']}
				             barColor={'var(--leaf-green-hp);'}
				             showLabel={false} rounded={false}
				/>
			</HealthBarContainer>
		</Container>
	);
}

const Container = styled.div`
	height: 100%;
	width: 90%;
	padding-left: 1rem;
	padding-top: 3rem;
	
	display: flex;
`;

const HealthBarLabel = styled.div`
	padding-right: .5rem;

	color: var(--leaf-green-hp-label);
`;

const HealthBarContainer = styled.div`
	padding-top: .2rem;
	width: 100%;
`;

function mapStateToProps(state, ownProps) {
	return {
		healthBar: state.health.healthBar,
		connected: state.socketConnection.connected
	};
}

const mapDispatchToProps = {
	getTodaysHealth
};


export default connect(mapStateToProps, mapDispatchToProps)(HealthBar);