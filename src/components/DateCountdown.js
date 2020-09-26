import React, { useEffect, useState } from "react";
import styled from 'styled-components';
import BigNumber from "./BigNumber";
import { dayDiff } from "../common/utils";

function DateCountdown({endDate, color, ...props}) {
	const [daysUntil, setDaysUntil] = useState(0);

	useEffect(() => {
		setDaysUntil(dayDiff(new Date(), endDate));
	}, [endDate]);

	return (
		<Container>
			<BigNumber number={daysUntil} color={color} fontSize={6}/>
			<CountdownText color={color}>
				days until {formattedEndDate()}
			</CountdownText>
		</Container>
	);

	function formattedEndDate() {
		return endDate.toLocaleString('default', {month: 'long'}) + ' ' + endDate.getDay();
	}
}

const Container = styled.div`
	display: flex;
	flex-direction: column;
`;

const CountdownText = styled.div`
	width: 100%;
	text-align: center;
	color: ${props => props.color ? props.color : 'var(--muted-green)'};
`;

export default DateCountdown;

