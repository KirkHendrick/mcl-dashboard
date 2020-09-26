import React, { useEffect, useState } from 'react';

function DailyIncome() {
	const [incomeSources] = useState([]);

	useEffect(() => {

	}, []);

	return (
		<div>
			{incomeSources.map(income => {
				return <div>
					{income.name}: ${income.dailyAmount}
				</div>
			})}
		</div>
	);
}

export default DailyIncome;
