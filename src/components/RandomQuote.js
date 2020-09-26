import React, { useEffect } from "react";
import { connect } from "react-redux";
import { getRandomQuote } from "../redux/actions/quoteActions";
import styled from 'styled-components';

function RandomQuote({getRandomQuote, quote, expanded, ...props}) {
	useEffect(() => {
		getRandomQuote();
	}, [getRandomQuote]);

	return (
		<Container>
			<QuoteIcon>
				<Icon onClick={() => getRandomQuote()}>"</Icon>
			</QuoteIcon>
			<QuoteText>
				{quote.Text}
			</QuoteText>
			{(expanded && quote.Notes) && (
				<ExtendedQuote> {quote.Notes} </ExtendedQuote>
			)}
			<QuoteSource>
				{quote.AuthorName} {quote.AuthorName && quote.SourceName ? ' - ' : ''} {quote.SourceName}
			</QuoteSource>
		</Container>
	);
}

const Container = styled.div`
	padding-left: 2rem;
	padding-right: 2rem;

	height: 90%;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
`;

const QuoteIcon = styled.div`
	font-size: 3rem;
	color: var(--muted-purple);
	font-family: "Playfair Display", serif;

	display: flex;
	justify-content: space-between;
`;

const QuoteText = styled.div`
	align-self: center;
	font-size: 130%;
	flex-grow: 2;
	font-family: "Playfair Display", serif;

	display: flex;
`;

const QuoteSource = styled.div`
	font-style: italic;
	align-self: flex-end;
`;

const ExtendedQuote = styled.div`
	font-family: "Playfair Display", serif;
	align-self: flex-end;
	font-size: 110%;
	font-style: italic;
	flex-grow: 2;
`;

const Icon = styled.div`
	cursor: pointer;
	
	&:hover {
		transform: scale(1.2);
	}
`;

function mapStateToProps(state, ownProps) {
	return {
		quote: state.quote
	};
}

const mapDispatchToProps = {
	getRandomQuote
};

export default connect(mapStateToProps, mapDispatchToProps)(RandomQuote);