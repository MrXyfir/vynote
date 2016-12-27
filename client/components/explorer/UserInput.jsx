import React from "react";

// Action creators
import { error, success } from "actions/notification";
import { 
	createFolder, createDocument, renameObject, moveObject
} from "actions/explorer/index";
import { closeUserInput } from "actions/explorer/user-input";

// Action types
import { 
	CREATE_DOCUMENT, CREATE_FOLDER, RENAME_OBJECT, MOVE_OBJECT
} from "constants/action-types/explorer/user-input";

// Other constants
import colors from "constants/colors";

export default class UserInput extends React.Component {
	
    constructor(props) {
        super(props);
        
        this.onCreateDocument = this.onCreateDocument.bind(this);
        this.onCreateFolder = this.onCreateFolder.bind(this); 
        this.onRenameObject = this.onRenameObject.bind(this);
        this._handleSubmit = this._handleSubmit.bind(this);
        this.onMoveObject = this.onMoveObject.bind(this);
        this.onKeyPress = this.onKeyPress.bind(this);
        this.onClose = this.onClose.bind(this);
    }
    
    onClose() {
        this.props.dispatch(closeUserInput());
    }
    
	onCreateDocument() {
		const docTypes = ["", "note", "page", "code"]; 
		const docType  = docTypes.indexOf(
			this.refs.input.value.split(".").slice(-1)[0]
		);
		
		if (docType < 1 && this.refs.docType.value == 0) {
			this.props.dispatch(error(
				"You must provide a document type"
			));
			return;
		}
	
		let data = {
			objType: 2, folder: this.props.data.scope,
			docType: +this.refs.docType.value || docType,
			encrypt: (
				this.props.user.subscription > Date.now()
				? this.refs.key.value
				: ""
			),
			color: (
				this.props.user.subscription > Date.now()
				? this.refs.color.value
				: 7
			),
			name: (
				docType > -1
				? this.refs.input.value.replace("." + docTypes[docType], "")
				: this.refs.input.value
			)
		};
        
        if (data.docType != 1) {
            data.syntax =
				data.docType == 3 && this.props.user.subscription > Date.now()
                ? this.props.user.config.defaultCodeSyntax : 70;
        }
        
		this.props.socket.emit("create object", data, (err, res) => {
			if (err) {
				this.props.dispatch(error(res));
				
			}
			else {
				data = {
					doc_type: data.docType, doc_id: res, name: data.name,
					folder_id: data.folder, contributor: false,
					syntax: data.syntax, color: data.color,
					encrypted: data.encrypt != "",
					encrypt: data.encrypt
				};
                
				this.props.dispatch(createDocument(data));
				this.props.dispatch(success(`Document '${data.name}' created`)); 
			}
			
			this.props.dispatch(closeUserInput());
		});  
	}
	
	onCreateFolder() {
		let data = {
			objType: 1, folder: this.props.data.scope,
			name: this.refs.input.value,
			color: (
				(this.props.user.subscription > Date.now())
				? this.refs.color.value
				: 7
			),
		};
		
		this.props.socket.emit("create object", data, (err, res) => {
			if (err) {
				this.props.dispatch(error(res));
			}
			else {
				data = {
					name: data.name, parent_id: data.folder, folder_id: res
				};
			
				this.props.dispatch(createFolder(data));
				this.props.dispatch(success(`Folder ${data.name} created`));
			}
			
			this.props.dispatch(closeUserInput());
		});
	}
	
	onRenameObject() {
		const data = {
			objType: this.props.data.userInput.objType,
			name: this.refs.input.value,
			id: this.props.data.userInput.objId 
		};
	
		this.props.socket.emit("rename object", data, (err, msg) => {
			if (err) {
				this.props.dispatch(error(msg));
			}
			else {
				this.props.dispatch(renameObject(data));
				this.props.dispatch(success(`Renamed ${data.objType === 1 ? "folder" : "document"}`));
			}
			
			this.props.dispatch(closeUserInput());
		});
	}
	
	onMoveObject() {
		// Move object to folder
		const move = (to) => {
			const data = {
				objType: this.props.data.userInput.objType,
				id: this.props.data.userInput.objId, to
			};
            
			this.props.socket.emit("move object to folder", data, (err, msg) => {
				if (err) {
					this.props.dispatch(error(msg));
				}
				else {
					this.props.dispatch(moveObject(data));
					this.props.dispatch(success(`${data.objType === 1 ? "Folder" : "Document"} moved`));
				}
				
				this.props.dispatch(closeUserInput());
			});
		};

		// Move to currently scoped folder
		if (this.refs.moveToScopedFolder.checked) {
			move(this.props.data.scope);
		}
		// Move to directory in text input
		else {
			let directory = this.refs.input.value.charAt(0) == '/'
				? this.refs.input.value.substring(1).split('/') 
				: this.refs.input.value.split('/');
		
			if (directory[directory.length - 1] == "")
				directory.pop();
			
			// User wants to move object to root
			if (directory.length == 1) {
				if (this.props.data.userInput.objType == 2) {
					this.props.dispatch(error("Cannot move documents to home folder"));
					this.props.dispatch(closeUserInput());
				}
				else {
					move(0);
				}
			}
			// Move to non-root folder
			// Get folder id from directory string
			else {
				let folder = 0;
				
				// Find the folder id of the deepest folder
				// (the folder to move object to)
				directory.forEach((dir, i) => {
					if (i == 0) return;
					
					this.props.data.children[folder].forEach(child => {
						if (child.type == 1 && this.props.data.folders[child.id].name == dir) {
							folder = child.id;
						}
					});
				});
				
				// Don't move object
				if (folder == this.props.data.scope) {
					this.props.dispatch(closeUserInput());
				}
				// Couldn't find folder
				else if (folder == 0) {
					this.props.dispatch(error("Could not find folder"));
					this.props.dispatch(closeUserInput()); 
				}
				else {
					move(folder);
				}
			}
		}
	}
	
	onKeyPress(e) {
		if (e.key === "Enter") {
            e.preventDefault();
			this._handleSubmit();
		}
	}
    
    _handleSubmit() {
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
	
	render() {
		let inputTitle = "", inputContent = "", inputExtended;
	
		// Set variables for input area
		// Returns empty div if userInput has no action
		switch (this.props.data.userInput.action) {
			case CREATE_DOCUMENT:
				inputTitle = "Create Document";
				inputContent = "New Document - " + Date.now().toString().substr(-6);
				inputExtended = (
					<div className="explorer-user-input-extended">
						<select ref="docType" defaultValue={this.props.user.config.defaultDocumentType}>
							<option value="0">Document Type</option>
							<option value="1">Note</option>
							<option value="2">Page</option>
							<option value="3">Code</option>
						</select>
						
						{
							(this.props.user.subscription > Date.now())
							? <select ref="color" defaultValue={this.props.user.config.defaultExplorerObjectColor}>{
								colors.map((color, i) => { return <option value={i}>{color}</option>; })
							  }</select>
							: <span></span>
						}
						
						{
							(this.props.user.subscription > Date.now())
							? <input type="text" placeholder="Encryption Key" ref="key" onKeyPress={this.onKeyPress} />
							: <span></span>
						}
					</div>
				); break;
			
			case CREATE_FOLDER:
				inputTitle = "Create Folder";
				inputContent = "New Folder - " + Date.now().toString().substr(-6);
				inputExtended = (
					(this.props.user.subscription > Date.now())
					? <div className="explorer-user-input-extended">
                        <select
							ref="color"
							defaultValue={
								this.props.user.config.defaultExplorerObjectColor
							}
						>{
                            colors.map((color, i) => {
								return <option value={i}>{color}</option>;
							})
                        }</select>
                      </div>
					: <span />
				);
				break;
				
			case RENAME_OBJECT:
				inputTitle = "Rename";
				inputContent = (
					this.props.data.userInput.objType === 1
					? this.props.data.folders[this.props.data.userInput.objId].name
					: this.props.data.documents[this.props.data.userInput.objId].name
				); break;
				
			case MOVE_OBJECT:
				inputTitle = "Move";
				inputContent = this.props.data.scopeParents.map(dir => {
					return dir.name;
				}).join("/") + "/" + this.props.data.folders[
					this.props.data.scope
				].name;
				inputExtended = (
					<div className="explorer-user-input-extended">
                        <span className="or">OR</span>
						<input
							ref="moveToScopedFolder"
							type="checkbox"
							defaultValue={false}
							onChange={(e) => {
								if (e.target.checked)
									this.refs.input.disabled = true;
								else
									this.refs.input.disabled = false;
							}}
						/>Move To Currently Scoped Folder
					</div>
				); break;
			
			default:
				return <div />;
		}
	
		return (
			<div className="explorer-user-input">
                <span className="explorer-user-input-title">{inputTitle}</span>
				<div className="inputs">
					<input 
						ref="input"
						type="text"
						autoFocus="true" 
						className="explorer-user-input-text" 
						onKeyPress={this.onKeyPress} 
						defaultValue={inputContent} 
					/>
					{inputExtended}
				</div>
				<div className="controls">
					<span
						className="icon-close"
						onClick={this.onClose}
						title="Close Input / Cancel Action"
					/>
                	<span
						className="icon-success"
						onClick={this._handleSubmit}
						title="Submit"
					/>
				</div>
			</div>
		);
	}
	
}