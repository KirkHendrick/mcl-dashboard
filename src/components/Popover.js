import React, { useCallback, useState } from "react";
import { connect } from 'react-redux';
import styled from 'styled-components';
import useEventListener from "../common/useEventListener";

function Popover({popover, ...props}) {
	const [mousePosition, setMousePosition] = useState({x: 0, y: 0});

	const handler = useCallback(({clientX, clientY}) => {
			setMousePosition({x: clientX, y: clientY});
		},
		[setMousePosition]
	);

	useEventListener('mousemove', handler);

	return (
		<Container>
			<PopoverContainer open={true} pos={mousePosition}>
				{popover ? popover.markup : ''}
			</PopoverContainer>
		</Container>
	);
}

const Container = styled.div`
	position: relative;
`;

const PopoverContainer = styled.div`
	top: ${props => props.pos.y}px;
	left: ${props => props.pos.x}px;

	position: absolute;
	max-height: ${props => props.open ? 10 : 0}rem;
	transition: all .3s ease-in-out;
	overflow: hidden;
`;

function mapStateToProps(state, ownProps) {
	return {
		popover: state.ui.popover
	};
}

const mapDispatchToProps = {};


export default connect(mapStateToProps, mapDispatchToProps)(Popover);