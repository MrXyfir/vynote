import React from "react";

import DirectoryAddress from "../components/explorer/DirectoryAddress";
import ExplorerObject from "../components/explorer/ExplorerObject";
import ControlBar from "../components/explorer/ControlBar";
import UserInput from "../components/explorer/UserInput";

export default class Explorer extends React.Component {
	
	render() {
		return (
			<div className="explorer">
				<DirectoryAddress data={this.props.data} dispatch={this.props.dispatch} />
				<ControlBar 
					data={this.props.data} 
					socket={this.props.socket} 
					dispatch={this.props.dispatch}
				/>
				<div className="explorer-objects">{
                    this.props.data.children[this.props.data.scope] !== undefined
					? this.props.data.children[this.props.data.scope].map(child => {
						let isDoc = (child.type == 2);
						
						return (
							<ExplorerObject
								data={this.props.data[isDoc ? "documents" : "folders"][child.id]} 
								socket={this.props.socket} 
								isDoc={isDoc} 
                                hover={this.props.data.hover} 
								dispatch={this.props.dispatch}
							/>
						);
					}) : <div />
				}</div>
				<UserInput 
					data={this.props.data} 
					socket={this.props.socket} 
					dispatch={this.props.dispatch} 
					subscription={this.props.user.subscription}
				/>
			</div>
		);
	}
	
}