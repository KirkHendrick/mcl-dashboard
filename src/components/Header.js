import React from "react";
import { connect } from 'react-redux';
import styled from 'styled-components';
import { ReactComponent as PauseIcon } from "../resources/pause_circle_outline-24px.svg";
import { ReactComponent as PlayIcon } from "../resources/play_circle_outline-24px.svg";
import { startAutoRefresh, stopAutoRefresh } from "../redux/actions/refreshActions";
import { weekNumber } from "../common/utils";

function Header({autoRefresh, startAutoRefresh, stopAutoRefresh, ...props}) {
	return (
		<Container>
			<PausePlayIcon onClick={() => {
				if (autoRefresh) {
					stopAutoRefresh();
				} else {
					startAutoRefresh();
				}
			}}>
				{autoRefresh ? <PauseIcon/> : <PlayIcon/>}
			</PausePlayIcon>
			<WeekNumber>
				Week {weekNumber()}
			</WeekNumber>
		</Container>
	);
}

const Container = styled.div`
	flex-basis: 10%;
	min-height: 4.5rem;

	background-color: #353535;
	color: white;

	box-shadow: 0 2px 1px rgba(0, 0, 0, 1);
	border-radius: 5px;
	margin-bottom: 1rem;
	margin-right: 1rem;
	padding: 1rem;

	display: flex;
	justify-content: space-between;
`;

const WeekNumber = styled.div`
	color: var(--muted-green);
	justify-self: flex-start;
`;

const PausePlayIcon = styled.div`
	cursor: pointer;
`;

function mapStateToProps(state, ownProps) {
	return {
		autoRefresh: state.autoRefresh
	};
}

const mapDispatchToProps = {
	startAutoRefresh, stopAutoRefresh
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);