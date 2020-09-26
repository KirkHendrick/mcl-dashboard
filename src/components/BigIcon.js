import React, { useEffect } from "react";
import styled from 'styled-components';

function BigIcon(
	{
		backgroundColor, Icon, pointer = true,
		scale, onClick,
		...props
	}) {
	useEffect(() => {
	}, []);

	return (
		<Container backgroundColor={backgroundColor}>
			<IconContainer>
				<Icon style={{cursor: pointer ? 'pointer' : '', transform: `scale(${scale ? scale : 1})`}}
				      onClick={onClick}/>
			</IconContainer>
		</Container>
	);
}

const Container = styled.div`
	height: 100%;
	width: 100%;
	border-radius: 20px;
	background-color: ${props => props.backgroundColor};
	
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

export default BigIcon;
