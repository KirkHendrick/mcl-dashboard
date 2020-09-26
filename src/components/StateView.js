import React, { useEffect } from "react";
import { connect } from 'react-redux';

function StateView({state, ...props}) {
	useEffect(() => {
	}, []);

	return (
		<div className='state-container'>
			state:
			{Object.keys(state).map(key => {
				console.log(key);
				console.log(state[key]);
				return <div>
					<Node state={state[key]}/>
				</div>
			})}
		</div>
	);
}

function Node({state, ...props}) {
	return (
		<div className='node'>
			{state && Array.isArray(state) ? state.map(item => {
					console.log(item);
					return <Node state={item}/>
				}) :
				typeof(state) === 'object' && Object.keys(state).map(key => {
					console.log(state);
					console.log(key);
					return <div>
						{key}
						state && typeof (state[key] === 'object') ? <Node state={state[key]}/> :
						<>
							{key}: {state[key]}
						</>

						}
					</div>
				})
			}
		</div>
	);
}

function mapStateToProps(state, ownProps) {
	return {
		state: state
	};
}

const mapDispatchToProps = {};


export default connect(mapStateToProps, mapDispatchToProps)(StateView);