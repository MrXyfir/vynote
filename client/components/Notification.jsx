import React from "react";

import { clear } from "../actions/notification";

export default class Notification extends React.Component {

	constructor(props) {
		super(props);
        
        this.onMouseOver = this.onMouseOver.bind(this);
        this.onMouseOut = this.onMouseOut.bind(this);
        this._clear = this._clear.bind(this);
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
			<div className={`notification notification-${this.props.data.status}`}>
                <span className={"icon icon-" + this.props.data.status} />
                <span className="message">{this.props.data.message}</span>
            </div>
		);
	}

}