import React from "react";
import styled from "styled-components";

function BigNumber({number, color, fontSize, ...props}) {
	return (
		<Container>
			<Number color={color} fontSize={fontSize}>
				{number}
			</Number>
		</Container>
	);
}

const Container = styled.div`
	display: flex;
	justify-content: center;
	flex-direction: column;
	height: 100%;
`;

const Number = styled.div`
	font-size: ${props => props.fontSize ? props.fontSize : 9}rem;
	color: ${props => props.color ? props.color : 'var(--muted-green)'};
	width: 100%;
	text-align: center;
`;


export default BigNumber;