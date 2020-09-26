import React from "react";
import { connect } from 'react-redux';
import styled from 'styled-components';
import { logCompulsion } from "../redux/actions/compulsionActions";
import { ReactComponent as HandIcon } from '../resources/do_not_touch-24px.svg';

function CompulsionLogger(
	{
		logCompulsion,
		...props
	}) {

	return (
		<Container>
			<IconContainer>
				<HandIcon onClick={() => logCompulsion()} style={{
					transform: 'scale(5)',
					cursor: 'pointer'
				}} />
			</IconContainer>
		</Container>
	);
}

const Container = styled.div`
	height: 100%;
	width: 100%;
	border-radius: 20px;
	background-color: #b95b1a;
	
	display: flex;
	flex-direction: column;
	justify-content: center;
	text-align: center;
`;

const IconContainer = styled.div`
	opacity: 0.6;

	&:hover {
		opacity: 0.8;
	}
`;

function mapStateToProps(state, ownProps) {
	return {};
}

const mapDispatchToProps = {
	logCompulsion
};


export default connect(mapStateToProps, mapDispatchToProps)(CompulsionLogger);