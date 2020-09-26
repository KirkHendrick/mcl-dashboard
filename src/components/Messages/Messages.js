import React, { useEffect } from "react";
import './Messages.css'
import { connect } from 'react-redux';

function Messages({errors, ...props}) {
	useEffect(() => {
	}, [props.actions]);

	return (
		<div className='messages-container'>
			{errors.length ? (
				errors.map(error => {
					return <div key={error.stack} className='error-message'>{error.name} - {error.message}</div>
				})
			) : ''}
		</div>
	);
}

function mapStateToProps(state, ownProps) {
	return {
		errors: state.messages.errors
	};
}

export default connect(mapStateToProps)(Messages);
