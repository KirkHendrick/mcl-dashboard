import React, { useEffect, useState } from "react";
import styled from "styled-components";

function ProgressBar(
	{
		total, completed, barColor,
		rounded = true, showLabel = true,
		...props
	}) {
	const [displayedNumber, setDisplayedNumber] = useState(0);

	useEffect(() => {
		setDisplayedNumber(
			Math.round(completed / total * 100)
		);
	}, [completed, total]);

	return (
		<Container>
			{showLabel ? (displayedNumber ? displayedNumber + '%' : '0%') : ''}
			<Bars>
				<FillerBar size={completed / total} color={barColor} title={`${completed} out of ${total}`} rounded={rounded}>
				</FillerBar>
				<TotalBar size={(total - completed) / total} total={total} rounded={rounded}>
				</TotalBar>
			</Bars>
		</Container>
	);
}

const Container = styled.div`
	width: 90%;
	height: 100%;
	display: flex;
	flex-direction: column;
	padding-bottom: 2rem;
`;

const Bars = styled.div`
	display: flex;
	width: 100%;
	position: relative;
`;

const TotalBar = styled.div`
	z-index: 100;
	position: absolute;
	width: 100%;
	background-color: #1e1f1e;	
	height: .5rem;
	
	border-radius: ${props => props.rounded ? 5 : 0}px;
	background-clip: padding-box;
`;

const FillerBar = styled.div`
	width: ${props => props.size >= 1 ? 100 : props.size * 100}%;
	height: .5rem;
	z-index: 101;
	position: absolute;
	background-color: ${props => props.color ? props.color : 'var(--muted-green)'};	
	transition: width .7s ease-in-out;
	cursor: pointer;
	
	background-clip: padding-box;
	border-radius: ${props => props.rounded ? 5 : 0}px;
	
	&:hover {
		transform: scaleX(1.03);
	}
`;


export default ProgressBar;