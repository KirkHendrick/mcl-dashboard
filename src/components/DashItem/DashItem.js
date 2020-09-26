import React, { useCallback, useEffect, useState, useRef } from 'react';
import './DashItem.css'
import ComponentIndex from "../../common/componentIndex";
import { refresh } from "../../common/utils";
import { connect } from "react-redux";

function DashItem({widget, autoRefresh, ...props}) {
	let [showHeader, setShowHeader] = useState(true);
	let [rounded, setRounded] = useState(false);
	let [shadow, setShadow] = useState(true);

	const itemRef = useRef(null);

	const refreshFn = useCallback(
		(fn) => {
			const interval = refresh(widget.props, () => {
				if (autoRefresh && fn) {
					fn();
				}
			});
			return () => {
				clearInterval(interval);
			}
		}, [autoRefresh, widget]
	);

	let ComponentType;
	if (widget.Component && ComponentIndex[widget.Component]) {
		ComponentType = ComponentIndex[widget.Component];
	} else {
		ComponentType = 'Placeholder';
	}

	useEffect(() => {
		if (widget.props) {
			let widgetProps = JSON.parse(widget.props);
			setIfSpecified(widgetProps.showHeader, () => setShowHeader(widgetProps.showHeader));
			setIfSpecified(widgetProps.rounded, () => setRounded(widgetProps.rounded));
			setIfSpecified(widgetProps.shadow, () => setShadow(widgetProps.shadow));
		}

		function setIfSpecified(prop, fn) {
			if (prop !== undefined) {
				fn();
			}
		}
	}, [widget]);

	return (
		<div
			className={'dash-item ' +
			(rounded ? ' rounded ' : '') +
			(shadow ? ' shadow ' : '')
			}

			ref={itemRef}
		>
			<div className='card-container'>
				{showHeader ?
					<div className='card-header'>
						<div className='card-name'>
							{widget.Name}
						</div>
						<div className='card-controls'>
							{widget.controls && widget.controls.map(control => {
								return <div onClick={() => {
									toggleControl(control);
									control.action();
								}}
								            className={control.selected && 'selected-control'}>

									{control.label}
								</div>
							})}
						</div>
					</div> : <div>{}</div>
				}
				<div className='card-body'>
					<ComponentType page={props.page}
					               controls={widget.controls}
					               component={ComponentType}
					               config={widget.props}
					               widget={widget}
					               refresh={refreshFn}
					/>
				</div>
			</div>
		</div>
	)
		;

	function toggleControl(control) {
		control.selected = !control.selected;
	}
}

function mapStateToProps(state, ownProps) {
	return {
		autoRefresh: state.autoRefresh
	};
}

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(DashItem);
