import React from "react";

// Action creators
import { error, success } from "../../../actions/notification";

export default class Help extends React.Component {

	constructor(props) {
		super(props);
	}
	
	render() {
		return (
			<div className="user-help">
				Help
			</div>
		);
	}

}