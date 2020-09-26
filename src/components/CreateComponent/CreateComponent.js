import React, { useEffect } from "react";
import './CreateComponent.css'
import { connect } from 'react-redux';
import { createWidget, openWidgetInModal } from "../../redux/actions/widgetActions";

function CreateComponent({openWidgetInModal, createWidget, ...props}) {
	useEffect(() => {
	}, []);

	return (
		<div className='create-container'>
			<div className='create-button' onClick={() => add()}>
				+
			</div>
		</div>
	);

	function add() {
		let formData = {
			name: 'test',
			label: 'test',
			apiName: 'test',
			state: 'pomodoros',
			height: 1,
			width: 1,
			showHeader: true,
			rounded: false
		};

		createWidget({
			Component: 'DynamicContainer',
			props: '{"showHeader": true, "rounded": false, "shadow": true}',
			Name: formData.name,
			specs: {
				...formData
			}
		}, props.page);

	}
}

// function CreateForm({...props}) {
// 	const [formData, setFormData] = useState({
// 		name: 'test',
// 		label: 'test',
// 		apiName: 'test',
// 		state: 'pomodoros',
// 		height: 1,
// 		width: 1,
// 		showHeader: true,
// 		rounded: false
// 	});
//
// 	useEffect(() => {
// 	}, [formData]);
//
// 	return (
// 		<div className='create-form'>
// 			<form onSubmit={onSubmit}>
// 				<div className='create-form-input-container'>
// 					Name
// 					<input className='create-form-input' name={'name'} value={formData.name}
// 					       onChange={onFormInputChange}/>
// 				</div>
// 				<div className='create-form-input-container'>
// 					Label
// 					<input className='create-form-input' name={'label'} value={formData.label}
// 					       onChange={onFormInputChange}/>
// 				</div>
// 				<div className='create-form-input-container'>
// 					API Name
// 					<input className='create-form-input' name={'apiName'} value={formData.apiName}
// 					       onChange={onFormInputChange}/>
// 				</div>
// 				<div className='create-form-input-container'>
// 					State
// 					<input className='create-form-input' name={'state'} value={formData.state}
// 					       onChange={onFormInputChange}/>
// 				</div>
// 				<div className='create-form-input-container'>
// 					<input className='create-form-submit' type='submit' value='Create Component'/>
// 				</div>
// 			</form>
// 		</div>
// 	);
//
// 	function onSubmit(event) {
// 		event.preventDefault();
//
// 		createWidget({
// 			Component: 'DynamicContainer',
// 			props: '{"showHeader": true, "rounded": false, "shadow": true}',
// 			Name: formData.name,
// 			specs: {
// 				...formData
// 			}
// 		}, props.page);
// 	}
//
// 	function onFormInputChange(event) {
// 		setFormData({
// 			...formData,
// 			[event.target.name]: event.target.value
// 		});
// 	}
// }
//
function mapStateToProps(state, ownProps) {
	return {
	};
}

const mapDispatchToProps = {
	createWidget, openWidgetInModal
};


export default connect(mapStateToProps, mapDispatchToProps)(CreateComponent);