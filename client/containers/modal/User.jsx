import React from "react";

// Components
import Settings from "components/modal/user/Settings";
import Account from "components/modal/user/Account";
import Help from "components/modal/user/Help";

export default class User extends React.Component {

	constructor(props) {
		super(props);
	}

	render() {
		switch(this.props.data.modal.action.split('/')[2]) {
			case "SETTINGS":
				return (
					<Settings
						data={this.props.data} 
						socket={this.props.socket} 
						dispatch={this.props.dispatch}
					/>
				);
				
			case "ACCOUNT":
				return (
					<Account
						data={this.props.data} 
						socket={this.props.socket} 
						dispatch={this.props.dispatch}
					/>
				);
				
			case "HELP":
				return (
					<Help
						data={this.props.data} 
						socket={this.props.socket} 
						dispatch={this.props.dispatch}
					/>
				);
				
			default:
				return <div />;
		}
	}

}