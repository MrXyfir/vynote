import React from "react";

// Components
import ExplorerObject from "components/explorer/ExplorerObject";
import ControlBar from "components/explorer/ControlBar";
import UserInput from "components/explorer/UserInput";
import Tabs from "components/explorer/tabs";

export default class Explorer extends React.Component {
	
	render() {
		return (
			<div className="explorer">
                <Tabs
                    data={this.props.data}
					socket={this.props.socket}
					dispatch={this.props.dispatch}
                />
				<ControlBar 
					data={this.props.data.explorer}
					socket={this.props.socket}
					dispatch={this.props.dispatch}
				/>
				<div className="explorer-objects">{
                    this.props.data.explorer.children[this.props.data.explorer.scope] !== undefined
					? this.props.data.explorer.children[this.props.data.explorer.scope].map(child => {
						return (
							<ExplorerObject
                                id={child.id}
                                type={child.type}
								data={this.props.data}
                                group={child.type == 1 ? "folders" : "documents"} 
								socket={this.props.socket}  
								dispatch={this.props.dispatch}
							/>
						);
					}) : <div />
				}</div>
				<UserInput
                    user={this.props.data.user}
					data={this.props.data.explorer} 
					socket={this.props.socket} 
					dispatch={this.props.dispatch} 
				/>
			</div>
		);
	}
	
}