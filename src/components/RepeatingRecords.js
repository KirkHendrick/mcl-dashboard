import React, { useEffect } from "react";
import { connect } from 'react-redux';
import { createRepeatingRecords } from "../redux/actions/repeatingRecordActions";
import { ReactComponent as RepeatIcon } from '../resources/repeat-24px.svg';
import BigIcon from "./BigIcon";

function RepeatingRecords(
	{
		createRepeatingRecords, repeatingRecords,
		...props
	}
) {

	useEffect(() => {
		if(repeatingRecords.success) {
			console.log('repeated records created');
		}
	}, [repeatingRecords.success]);

	return (
		<BigIcon backgroundColor={'var(--muted-purple)'} Icon={RepeatIcon} scale={3} onClick={() => {createRepeatingRecords()}}/>
	);
}

function mapStateToProps(state, ownProps) {
	return {
		repeatingRecords: state.repeatingRecords
	};
}

const mapDispatchToProps = {
	createRepeatingRecords
};


export default connect(mapStateToProps, mapDispatchToProps)(RepeatingRecords);