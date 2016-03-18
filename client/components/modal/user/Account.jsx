import React from "react";

// Action creators
import { error, success } from "../../../actions/notification";

export default class Account extends React.Component {

	constructor(props) {
		super(props);
	}
	
	render() {
		return (
			<div className="user-account">
				User Account
			</div>
		);
	}

}