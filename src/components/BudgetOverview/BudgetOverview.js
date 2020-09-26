import React, { useEffect, useState } from "react";
import './BudgetOverview.css'
import { connect } from 'react-redux';
import { getBudgetCategories, getBudgetAccounts } from "../../redux/actions/budgetActions";

function BudgetOverview({getBudgetCategories, getBudgetAccounts, relevantAccounts, budget, refresh, ...props}) {
	const [assets, setAssets] = useState([]);
	const [liabilities, setLiabilities] = useState([]);

	useEffect(() => {
		getBudgetCategories();
		getBudgetAccounts();
	}, [getBudgetCategories, getBudgetAccounts]);

	useEffect(() => {
		setAssets(relevantAccounts.filter(acc => acc.balance >= 0));
		setLiabilities(relevantAccounts.filter(acc => acc.balance < 0));

	}, [relevantAccounts]);

	return (
		<div className='budget-container'>
			<div className='assets'>
				{assets
					.map(account => {
						return <div key={account.id} className='account'>
							<div className='account-name'>
								{account.name}
							</div>
							<div className='account-balance '>
								<span
									className={account.balance >= 0 ? 'positive' : 'negative'}>${formattedNumber(account.balance)}</span>
							</div>
						</div>
					})}

			</div>
			<div className='liabilities'>
				{liabilities
					.map(account => {
						return <div key={account.id} className='account'>
							<div className='account-name'>
								{account.name}
							</div>
							<div className='account-balance '>
								<span
									className={account.balance >= 0 ? 'positive' : 'negative'}>${formattedNumber(account.balance)}</span>
							</div>
						</div>
					})}
			</div>
		</div>
	);

	function formattedNumber(num) {
		return Math.round(num / 1000).toLocaleString();
	}
}

function mapStateToProps(state, ownProps) {
	return {
		budget: state.budget,
		relevantAccounts: state.budget.accounts
			.filter(account => (account.on_budget || account.type === 'otherAsset' || account.type === "otherLiability") &&
				!account.closed && account.balance !== 0)
	};
}

const mapDispatchToProps = {
	getBudgetCategories, getBudgetAccounts
};


export default connect(mapStateToProps, mapDispatchToProps)(BudgetOverview);
