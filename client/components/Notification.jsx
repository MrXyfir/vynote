import React from "react";

import { clear } from "../actions/notification";

export default class Notification extends React.Component {

	constructor(props) {
		super(props);
	}

	componentWillUpdate() {
		clearTimeout(this.timeout);
	}
	
	onMouseOver() {
		clearTimeout(this.timeout);
	}
	
	onMouseOut() {
		this._clear();
	}
	
	_clear() {
		if (this.props.data.status != "clear") {
			// Clear notification after 7 seconds
			this.timeout = setTimeout(() => {
				this.props.dispatch(clear());
			}, 7000);
		}
	}

	render() {
		this._clear();
	
		return (
			<div className={`notification notification-${this.props.data.status}`}>{
				this.props.data.message
			}</div>
		);
	}

}