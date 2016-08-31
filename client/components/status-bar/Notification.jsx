import React from "react";

import { clear } from "actions/notification";

import Advertisement from "./Advertisement";

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
            let timeout = {
                advert: 12000, error: 7000, warning: 5000, success: 3500, info: 3500
            };
            
			// Clear notification after 7 seconds
			this.timeout = setTimeout(() => {
				this.props.dispatch(clear());
			}, timeout[this.props.data.status]);
		}
	}

	render() {
		this._clear();
        
        if (this.props.data.status == "advert")
            return <Advertisement data={this.props.data} />;
	
		return (
			<div 
                className={`notification notification-${this.props.data.status}`} 
                onMouseOver={this.onMouseOver} onMouseOut={this.onMouseOut}
            >
                <span className={"icon icon-" + this.props.data.status} />
                <span className="message">{this.props.data.message}</span>
            </div>
		);
	}

}