import React, { useEffect} from "react";
import { connect } from 'react-redux';

function ActionMenu({context, ...props}) {
	// const [x, setX] = useState('0px');
	// const [y, setY] = useState('0px');
	// const menuRef = useRef(null);
	//
	useEffect(() => {
		if (context) {
			// 		setX(context.x + 'px');
			// 		setY(context.y + 'px');
			// 		setShown(context.shown);
		}
	}, [context]);

	return (
		<div className='action-menu'>
			action menu
		</div>
	);
}

function mapStateToProps(state, ownProps) {
	return {
		// _: state._
	};
}

const mapDispatchToProps = {};


export default connect(mapStateToProps, mapDispatchToProps)(ActionMenu);