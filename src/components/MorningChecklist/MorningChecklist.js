import React, { useEffect } from "react";
import './MorningChecklist.css'
import { connect } from 'react-redux';
import { getMorningChecklist, completeMorningChecklistItem } from "../../redux/actions/checklistActions";

function MorningChecklist({getMorningChecklist, checklists, completeMorningChecklistItem, ...props}) {
	useEffect(() => {
		if(!checklists.length) {
			getMorningChecklist();
		}
	}, [checklists, getMorningChecklist]);

	return (
		<div className='checklists-overall-container'>
			{!checklists.filter(c => c.items.filter(i => !i.checked).length).length &&
			<div className='completed'>completed</div>}
			<div className='checklists-container'>
				{checklists.map(checklist => {
					return <div key={checklist.name} className='checklist-container'>
						<div className='checklist-subheader'>
						<span className={!checklist.items.filter(item => !item.checked).length && 'subheader-checked' +
						' strike'
						}>
							{checklist.name.toLowerCase()}
						</span>
						</div>
						<div className='list-container'>
							{checklist.items.map(item =>
								<div key={item.label} className='list-item'>
									<div onClick={() => toggle(checklist, item)}
									     className={item.checked && 'checked'}>
										<span className={item.checked && 'strike'}>{item.label}</span>
									</div>
								</div>)}
						</div>
					</div>
				})}
			</div>
		</div>
	);

	function toggle(checklist, item) {
		completeMorningChecklistItem(checklist, item);
	}
}

function mapStateToProps(state, ownProps) {
	return {
		checklists: state.checklists
	};
}

const mapDispatchToProps = {
	getMorningChecklist, completeMorningChecklistItem
};


export default connect(mapStateToProps, mapDispatchToProps)(MorningChecklist);