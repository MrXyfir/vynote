import React from "react";

// Action creators
import { openUserModal } from "actions/modal/user/index";

// Action types
import {
    ACCOUNT, HELP, SETTINGS
} from "constants/action-types/modal/user/index";

export default class QuickLinks extends React.Component {

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
                <a
                    className="icon-user"
                    onClick={() => this.onOpen(1)}
                    title="User account"
                />
                
                <a
                    className="icon-help"
                    onClick={() => this.onOpen(2)}
                    title="Help documents"
                />
                
                <a
                    className="icon-settings"
                    onClick={() => this.onOpen(3)}
                    title="Settings"
                />
            </div>
		);
	}

}