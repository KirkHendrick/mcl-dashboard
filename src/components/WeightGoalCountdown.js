import React, { useEffect } from "react";
import { connect } from 'react-redux';
import styled from 'styled-components';
import DateCountdown from "./DateCountdown";

const COLOR = 'var(--muted-dark-blue)';

function WeightGoalCountdown({...props}) {
	useEffect(() => {
	}, []);

	return (
		<Container>
			<DateCountdown endDate={new Date(2020, 10, 7)} color={COLOR} />
		</Container>
	);
}

const Container = styled.div`

`;

function mapStateToProps(state, ownProps) {
	return {
	};
}

const mapDispatchToProps = {
};


export default connect(mapStateToProps, mapDispatchToProps)(WeightGoalCountdown);