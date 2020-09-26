import React, { useEffect } from "react";
import './Notes.css'
import { connect } from 'react-redux';
import { getNotes } from '../../redux/actions/noteActions';
import errorLogger from "../../common/errorLogger";
import Spinner from "../../common/Spinner";

const coreFour = 'Me, Inc.';
function Notes({getNotes, notes, ...props}) {
	useEffect(() => {
		getNotes('Me, Inc.').catch(errorLogger);
	}, [getNotes]);

	return (
		<div className='generic-notes-container'>
			{props.loading ? <Spinner/> :
				notes.length && notes.map(note =>
					<div key={note.Notes}
					     onClick={() => {
					     }}
					     className='note'>
						<div className='note-heading'>{note.Name}</div>
						<div className='note-body'>
							{note.Notes ? note.Notes.split('\n').map(line => {
								return <div className='note-line'>{line}</div>
							}) : note.Notes}
						</div>
					</div>
				)
			}
		</div>
	);
}

function mapStateToProps(state, ownProps) {
	const category = ownProps.page['Category Name'][0];

	return {
		notes: !state.notes[coreFour] || !state.notes[coreFour].length ? [] : state.notes[coreFour].filter(note => {
			return category === note['Category Name'][0];
		}),
		loading: state.apiCallsInProgress > 0
	};
}

const mapDispatchToProps = {
	getNotes
};


export default connect(mapStateToProps, mapDispatchToProps)(Notes);