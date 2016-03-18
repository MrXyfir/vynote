import React from "react";

// Action creators
import { error, success } from "../../../actions/notification";

export default class Settings extends React.Component {

	constructor(props) {
		super(props);
	}
	
	render() {
		return (
			<div className="user-settings">
				Settings
			</div>
		);
	}

}