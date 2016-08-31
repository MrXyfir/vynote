import React from "react";

// Action creators
import {
	loadVersions, deleteVersion, createVersion
} from "actions/modal/document-controls/versions";
import {
	loadContent
} from "actions/documents/index";
import {
	error, success
} from "actions/notification";
import {
	close
} from "actions/modal/index";

// Modules
import buildNoteObject from "../../../../lib/notes-convert/to-object";

export default class VersionControl extends React.Component {

	constructor(props) {
		super(props);
        
        this.onCreateVersion = this.onCreateVersion.bind(this);
        this.onDeleteVersion = this.onDeleteVersion.bind(this);
        this.onLoadVersion = this.onLoadVersion.bind(this);
	}
	
	componentWillMount() {
		this.props.socket.emit("list versions", this.props.data.document.doc_id, versions => {
			this.props.dispatch(loadVersions(versions));
		});
	}
	
	onLoadVersion(name) {
		this.props.socket.emit("load version", this.props.data.document.doc_id, name, (err, msg) => {
			if (err) {
				this.props.dispatch(error(msg));
			}
			else {
				let event = (
					this.props.data.document.doc_type == 1
					? "get note elements" : "get document content"
				);
			
				// Load documents new content and push to state
				this.props.socket.emit(
					event,
					this.props.data.document.doc_id,
					this.props.data.document.encrypt,
					(err, content) => {
						if (err) {
							location.reload();
						}
						else {
							content = (
								this.props.data.document.doc_type == 1
								? buildNoteObject(content) : content
							);
						
							this.props.dispatch(loadContent(content));
							this.props.dispatch(close());
							this.props.dispatch(success(`Document reverted to version '${name}'`));
						}
					}
				);
			}
		});
	}
	
	onDeleteVersion(name) {
		this.props.socket.emit(
			"delete version", this.props.data.document.doc_id, name,
			(err) => {
				if (err) {
					this.props.dispatch(error(`Could not delete version '${name}'`));
				}
				else {
					this.props.dispatch(deleteVersion(name));
					this.props.dispatch(success(`Deleted version '${name}'`));
				}
			}
		);
	}
	
	onCreateVersion() {
		let name = this.refs.name.value;
		
		this.props.socket.emit(
			"create version", this.props.data.document.doc_id, name,
			(err, msg) => {
				if (err) {
					this.props.dispatch(error(msg || "An unknown error occured"));
				}
				else {
					this.props.dispatch(createVersion(name));
					this.props.dispatch(success(`Created version '${name}'`));
				}
			}
		);
	}
	
	render() {
		if (this.props.data.modal.versions == undefined) {
			return (
				<div className="loading">
					<span className="icon-loading" />
					<span>Loading version control data</span>
				</div>
			);
		}
	
		return (
			<div className="document-version-control">
				<h3>What are document versions?</h3>
				<p>
					When you create a document version, the document's current content is saved with that version's name. Each version will be stored for up to 7 days or until 10 following versions are created. You can revert to a document's previous version at any time. When you revert to a version, the current content of the document is wiped and replaced with the content that was present when the version was created.
				</p>
			
				<div className="document-version-create">
					<input type="text" ref="name" placeholder="Version Name" />
					<span 
						className="icon-add" 
						onClick={this.onCreateVersion} 
						title="Create Version"
					/>
				</div>
				<div className="document-version-list">{
					this.props.data.modal.versions.map(version => {
						return (
							<div className="document-version-list-item">
								<span title="Version Name" className="name">{version.name}</span>
								<span title="Created" className="created">{
                                    (new Date(version.created)).toLocaleString()
                                }</span>
								<div className="document-version-controls">
									<span 
										title="Revert to Version" 
										className="icon-version-revert" 
										onClick={this.onLoadVersion.bind(this, version.name)}
									/>
									<span 
										title="Delete Version" 
										className="icon-trash" 
										onClick={this.onDeleteVersion.bind(this, version.name)}
									/>
								</div>
							</div>
						);
					})
				}</div>
			</div>
		);
	}

}