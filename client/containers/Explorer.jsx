import { Component } from "react";

import DirectoryAddress from "../components/explorer/DirectoryAddress";
import ControlBar from "../components/explorer/ControlBar";
import UserInput from "../components/explorer/UserInput";
import Object from "../components/explorer/Object";

export default class Explorer extends Component {
	
	render() {
		return (
			<div className="explorer">
				<DirectoryAddress data={this.props.data} dispatch={this.props.dispatch} />
				<ControlBar 
					data={this.props.data} 
					emit={this.props.emit} 
					dispatch={this.props.dispatch}
				/>
				<div className="explorer-objects">
					<div className="explorer-objects-folders">{
						Object.keys(this.props.folders).map(id => {
							return (<Object 
								data={this.props.folders[id]}
								emit={this.props.emit} 
								dispatch={this.props.dispatch}
							/>);
						})
					}</div>
					<div className="explorer-objects-documents">{
						Object.keys(this.props.documents).map(id => {
							return (<Object 
								data={this.props.documents[id]}
								emit={this.props.emit} 
								dispatch={this.props.dispatch}
							/>);
						})
					}</div>
				</div>
				<UserInput 
					data={this.props.data} 
					emit={this.props.emit} 
					dispatch={this.props.dispatch} 
					subscription={this.props.user.subscription}
				/>
			</div>
		);
	}
	
}