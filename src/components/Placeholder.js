import React from "react";

function Placeholder({...props}) {
	return (
		<div>
			No component indexed as {props.Component}.
		</div>
	);
}

export default Placeholder;
