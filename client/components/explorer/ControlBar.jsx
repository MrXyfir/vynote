import React from "react";

import { triggerCreateFolder, triggerCreateDocument } from "../../actions/explorer/user-input";
import { navigateToFolder, loadFileSystem } from "../../actions/explorer/";
import { error } from "../../actions/notification";

import { buildExplorerObject } from "../../lib/explorer/build";

export default class ControlBar extends React.Component {
	
	constructor(props) {
		super(props);
        
        this.onNavigateToParent = this.onNavigateToParent.bind(this);
        this.onCreateDocument = this.onCreateDocument.bind(this);
        this.onNavigateToRoot = this.onNavigateToRoot.bind(this);
        this.onCreateFolder = this.onCreateFolder.bind(this);
        this.onRefresh = this.onRefresh.bind(this);
	}
	
	onCreateFolder() {
		// UserInput will handle creation process
		this.dispatch(triggerCreateFolder());
	}
	
	onCreateDocument() {
		if (this.props.data.scope === 0) {
			// Cannot create documents in root
			this.dispatch(error("Cannot create documents in root folder"));
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
				<span className="explorer-active-folder" title="Active Folder">{
					this.props.data.folders[this.props.data.scope].name
				}</span>
				<span
					title="Go to Parent Folder" 
					className={this.props.data.scope > 0 ? "icon-level-up" : ""} 
					onClick={this.onNavigateToParent}
				/>
				<span className="icon-folder-add" title="Create Folder" onClick={this.onCreateFolder} />
				<span className="icon-doc-add" title="Create Document" onClick={this.onCreateDocument} />
				<span className="icon-refresh" title="Refresh" onClick={this.onRefresh} />
				<span className="icon-home" title="Go to Home Folder" onClick={this.onNavigateToRoot} />
			</div>
		);
	}
	
}