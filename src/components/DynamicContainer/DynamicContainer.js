import React, { useCallback, useEffect, useState } from "react";
import './DynamicContainer.css'
import ComponentIndex from "../../common/componentIndex";
import { connect } from 'react-redux';

function DynamicContainer({...props}) {
	const [componentName, setComponentName] = useState('');
	const [ComponentType, setComponentType] = useState('Placeholder');
	const [showComponentInput] = useState(true);

	const specs = props.widget.specs;

	useEffect(() => {
		if (ComponentIndex[componentName]) {
			setComponentType(ComponentIndex[componentName]);
		}
	}, [componentName]);

	useEffect(() => {
		console.log(props);
		if (specs) {
			debugger;
		}
	}, [specs, props.specs, props]);

	const cmp = useCallback(({...props}) => {
		if (specs) {
			console.log(props);
			return (<>
					<div>{specs.name}</div>
					<div>{specs.label}</div>
					<div>{specs.apiName}</div>
				</>
			);
		}
	}, [specs]);

	const mapStateToProps = (state, ownProps) => {
		return {
			[specs.state]: state[specs.state]
		};
	};

	const mapDispatchToProps = {};
	const Template = connect(mapStateToProps, mapDispatchToProps)(cmp);

	return (
		<>
			{specs ?
				<div>
					<Template/>
				</div>
				:
				<div className='dynamic-container'>
					{props.widget.markup ? props.widget.markup :
						showComponentInput ?
							<>
								<input className='component-input' value={componentName}
								       onChange={(event) => setComponentName(event.target.value)}/>
								<ComponentType props={props}/>
							</> :
							<></>
					}
				</div>
			}
		</>
	);

}

export default DynamicContainer;