import React from "react";

// Action creators
import { error, success } from "../../actions/notification";
import { 
	createFolder, createDocument, renameObject, moveObject
} from "../../actions/explorer/";
import { closeUserInput } from "../../actions/explorer/user-input";

// Action types
import { 
	CREATE_DOCUMENT, CREATE_FOLDER, RENAME_OBJECT, MOVE_OBJECT
} from "../../constants/action-types/explorer/user-input";

// Other constants
import colors from "../../constants/colors";

export default class UserInput extends React.Component {
	
	onCreateDocument() {
		if (this.refs.docType.value === 0) {
			this.dispatch(error("You must select a document type"));
			return;
		}
	
		let data = {
			objType: 2, folder: this.props.data.scope,
			docType: this.refs.docType.value,
			encrypt: (
				(Date.now() > this.props.subscription)
				? this.refs.key.value
				: ""
			),
			color: (
				(Date.now() > this.props.subscription)
				? this.refs.color.value
				: 7
			),
			name: this.refs.input.innerHTML
		};
	
		this.props.emit("create object", data, (err, res) => {
			if (err) {
				this.dispatch(error(res));
				
			}
			else {
				data = {
					doc_type: data.docType, doc_id: res, name: data.name,
					encrypt: data.encrypt, encrypted: data.encrypt != "",
					contributor: false, syntax: 7, color: data.color,
					folder_id: data.folder
				};
			
				this.dispatch(createDocument(data));
				this.dispatch(success(`Document '${data.name}' created`)); 
			}
			
			this.dispatch(closeUserInput());
		});  
	}
	
	onCreateFolder() {
		let data = {
			objType: 1, folder: this.props.data.scope,
			name: this.refs.input.innerHTML,
			color: (
				(Date.now() > this.props.subscription)
				? this.refs.color.value
				: 7
			),
		};
		
		this.props.emit("create object", data, (err, res) => {
			if (err) {
				this.dispatch(error(res));
			}
			else {
				data = {
					name: data.name, parent_id: data.folder, folder_id: res
				};
			
				this.dispatch(createFolder(data));
				this.dispatch(success(`Folder ${data.name} created`));
			}
			
			this.dispatch(closeUserInput());
		});
	}
	
	onRenameObject() {
		const data = {
			objType: this.props.data.userInput.objType,
			name: this.refs.input.innerHTML,
			id: this.props.data.userInput.objId 
		};
	
		this.props.emit("rename object", data, (err, msg) => {
			if (err) {
				this.dispatch(error(msg));
			}
			else {
				this.dispatch(renameObject(data));
				this.dispatch(success(`Renamed ${data.objType === 1 ? "folder" : "document"}`));
			}
			
			this.dispatch(closeUserInput());
		});
	}
	
	onMoveObject() {
		let directory = this.refs.input.innerHTML.split('/');
		
		const move = (to) => {
			const data = {
				objType: this.props.data.userInput.objType,
				id: this.props.data.userInput.objId, to
			};
		
			this.props.emit("move object to folder", data, (err, msg) => {
				if (err) {
					this.dispatch(error(msg));
				}
				else {
					this.dispatch(moveObject(data));
					this.dispatch(success(`${data.objType === 1 ? "Folder" : "Document"} moved`));
				}
				
				this.dispatch(closeUserInput());
			});
		};
		
		// User wants to move object to root
		if (directory.length == 1) {
			if (this.props.data.userInput.objType == 2) {
				this.dispatch(error("Cannot move documents to root"));
				this.dispatch(closeUserInput());
			}
			else {
				move(0);
			}
		}
		else {
			let folder = 0;
			
			// Find the folder id of the deepest folder
			// (the folder to move object to)
			directory.forEach((dir, i) => {
				if (i == 0) return;
				
				for (let child in this.props.data.children[folder]) {
					if (this.props.data.folders[child].name == dir) {
						folder = child;
						break;
					}
				}
			});
			
			// Don't move object
			if (folder == this.props.data.scope) {
				this.dispatch(closeUserInput());
			}
			// Couldn't find a folder at that address
			else if (folder == 0) {
				this.dispatch(error("No folder exists at that address"));
				this.dispatch(closeUserInput()); 
			}
			else {
				move(folder);
			}
		}
	}
	
	onKeyPress(e) {
		if (e.key === "Enter") {
			// Call appropriate handler function based on action
			switch (this.props.data.userInput.action) {
				case CREATE_DOCUMENT:
					return this.onCreateDocument();
				case CREATE_FOLDER:
					return this.onCreateFolder();
				case RENAME_OBJECT:
					return this.onRenameObject();
				case MOVE_OBJECT:
					return this.onMoveObject();
			}
		}
	}
	
	render() {
		let inputTitle = "", inputDescription = "", inputContent = "", inputExtended;
	
		// Set variables for input area
		// Returns empty div if userInput has no action
		switch (this.props.data.userInput.action) {
			case CREATE_DOCUMENT:
				inputTitle = "Create Document";
				inputDescription = "Configure a new document";
				inputContent = "New Document - " + Date.now().toString().substr(-6);
				inputExtended = (
					<div className="explorer-user-input-extended">
						<select ref="docType" defaultValue="0">
							<option value="0">Document Type</option>
							<option value="1">Note</option>
							<option value="2">Page</option>
							<option value="3">Code</option>
						</select>
						
						{
							(Date.now() > this.props.subscription)
							? <select ref="color" defaultValue="7">{
								colors.map((color, i) => { return <option value={i}>{color}</option>; })
							  }</select>
							: <span></span>
						}
						
						{
							(Date.now() > this.props.subscription)
							? <input type="text" placeholder="Encryption Key" ref="key" />
							: <span></span>
						}
					</div>
				); break;
			
			case CREATE_FOLDER:
				inputTitle = "Create Folder";
				inputDescription = "Configure a new folder";
				inputContent = "New Folder - " + Date.now().toString().substr(-6);
				inputExtended = (
					(Date.now() > this.props.subscription)
					? <div className="explorer-user-input-extended"><select ref="color" defaultValue="7">{
						colors.map((color, i) => { return <option value={i}>{color}</option>; })
					  }</select></div>
					: <span></span>
				);
				break;
				
			case RENAME_OBJECT:
				inputTitle = "Rename";
				inputDescription = "Rename a " + (this.props.data.userInput.objType === 1 ? "folder" : "document");
				inputContent = (
					this.props.data.userInput.objType === 1
					? this.props.data.folders[this.props.data.userInput.objId].name
					: this.props.data.documents[this.props.data.userInput.objId].name
				); break;
				
			case MOVE_OBJECT:
				inputTitle = "Move";
				inputDescription = "Move a " + (this.props.data.userInput.objType === 1 ? "folder" : "document");
				inputContent = this.props.data.scopeParents.map(dir => {
					return dir.name;
				}).join("/") + "/" + this.props.data.folders[this.props.data.scope].name;
				break;
			
			default:
				return <div></div>;
		}
	
		return (
			<div className="explorer-user-input">
				<div className="explorer-user-input-head">
					<span className="explorer-user-input-title">{inputTitle}</span>
					<span className="explorer-user-input-description">{inputDescription}</span>
				</div>
				{inputExtended}
				<div 
					ref="input"
					className="explorer-user-input-text" 
					onKeyPress={this.onKeyPress} 
					contentEditable={true}
				>{inputContent}</div>
			</div>
		);
	}
	
}