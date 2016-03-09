import React from "react";

// Action creators
import { openUserModal } from "../../actions/modal/user/";

// Action types
import {
    ACCOUNT, HELP, SETTINGS
} from "../../constants/action-types/modal/user/";

export default class Notification extends React.Component {

	constructor(props) {
		super(props);
	}
    
    shouldComponentUpdate() {
        return false;
    }
    
    onOpen(e) {
        switch (e) {
            case 1: return this.props.dispatch(openUserModal(ACCOUNT));
            case 2: return this.props.dispatch(openUserModal(HELP));
            case 3: return this.props.dispatch(openUserModal(SETTINGS));
        }
    }

	render() {
		return (
			<div className="quick-links">
                <span className="icon-user" />
                <a onClick={this.onOpen.bind(this, 1)}>Account</a>
                
                <span className="icon-info" />
                <a onClick={this.onOpen.bind(this, 2)}>Help</a>
                
                <span className="icon-settings" />
                <a onClick={this.onOpen.bind(this, 3)}>Settings</a>
            </div>
		);
	}

}