import { Component } from "react";

import { triggerCreateFolder, triggerCreateDocument, createDocumentInRoot } from "../../actions/explorer/control-bar";
import { navigateToFolder, loadFileSystem } from "../../actions/explorer/";

import { buildExplorerObject } from "../../lib/explorer/build";

export default class ControlBar extends Component {
	
	constructor(props) {
		super(props);
	}
	
	onCreateFolder() {
		// UserInput will handle creation process
		this.dispatch(triggerCreateFolder());
	}
	
	onCreateDocument() {
		if (this.props.data.scope === 0) {
			// Cannot create documents in root
			this.dispatch(createDocumentInRoot());
		}
		else {
			// UserInput will handle creation process
			this.dispatch(triggerCreateDocument());
		}
	}
	
	onNavigateToParent() {
		if (this.props.data.scope !== 0) {
			this.props.dispatch(navigateToFolder(
				this.props.data.folders[this.props.data.scope].parent_id
			));
		}
	}
	
	onRefresh() {
		// Refresh entire filesystem
		this.props.emit("get filesystem", (res) => {
			res = buildExplorerObject(res, this.props.data.scope);
			
			this.dispatch(loadFileSystem(res));
		});
	}
	
	onNavigateToRoot() {
		this.dispatch(navigateToFolder(0));
	}
	
	render() {
		return (
			<div className="explorer-control-bar">
				<span className="explorer-active-folder">{
					this.props.data.folders[this.props.data.scope].name
				}</span>
				<span
					className={this.props.data.scope > 0 ? "icon-level-up" : ""} 
					onClick={this.onNavigateToParent}
				></span>
				<span className="icon-folder-add" onClick={this.onCreateFolder}></span>
				<span className="icon-doc-add" onClick={this.onCreateDocument}></span>
				<span className="icon-refresh" onClick={this.onRefresh}></span>
				<span className="icon-home" onClick={this.onNavigateToRoot}></span>
			</div>
		);
	}
	
}