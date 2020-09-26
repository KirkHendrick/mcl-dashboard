import React, { useEffect } from "react";
import { connect } from 'react-redux';
import { getYesterdaysMeals, logMeal } from "../redux/actions/foodActions";
import styled from 'styled-components';

function FoodLogger({food, getYesterdaysMeals, logMeal, ...props}) {
	useEffect(() => {
		getYesterdaysMeals();
	}, [getYesterdaysMeals]);

	return (
		<FoodLogContainer>
			{food.meals && food.meals.length ? food.meals.map(meal => {
				return <div>{meal.Name}</div>
			}) : <></>}
		</FoodLogContainer>
	);
}

function mapStateToProps(state, ownProps) {
	return {
		food: state.food
	};
}

const mapDispatchToProps = {
	getYesterdaysMeals, logMeal
}

export default connect(mapStateToProps, mapDispatchToProps)(FoodLogger);

const FoodLogContainer = styled.div`
	padding: 1rem;
`;

