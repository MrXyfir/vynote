import React from "react";

// Action creators
import {
	triggerRenameObject, triggerMoveObject
} from "../../actions/explorer/user-input";
import { error } from "../../actions/notification";
import {
    navigateToFolder, deleteObject, hoverObject
} from "../../actions/explorer/";
import {
    loadDocument, deleteDocument
} from "../../actions/documents/";
import { initializeRenderObject } from "../../actions/documents/note";

// Constants
import colors from "../../constants/colors";

// Modules
import buildNote from "../../lib/note/build";

export default class ExplorerObject extends React.Component {

	constructor(props) {
		super(props);
        
        this.onMouseOver = this.onMouseOver.bind(this);
        this.onRename = this.onRename.bind(this);
        this.onDelete = this.onDelete.bind(this);
        this.onMove = this.onMove.bind(this);
        this.onOpen = this.onOpen.bind(this);
	}

    onMouseOver() {
        this.props.dispatch(hoverObject(
            (this.props.isDoc ? 2 : 1),
			this.props.data[this.props.isDoc ? "doc_id" : "folder_id"]
        ));
    }

	onRename() {
		this.props.dispatch(triggerRenameObject(
			(this.props.isDoc ? 2 : 1),
			this.props.data[this.props.isDoc ? "doc_id" : "folder_id"]
		));
	}
	
	onMove() {
		this.props.dispatch(triggerMoveObject(
			(this.props.isDoc ? 2 : 1),
			this.props.data[this.props.isDoc ? "doc_id" : "folder_id"]
		));
	}
	
	onDelete() {
		let type = this.props.isDoc ? 2 : 1;
		let id = this.props.data[type == 2 ? "doc_id" : "folder_id"]
		
		this.props.socket.emit("delete object", type, id, (err, msg) => {
			if (err) {
				this.props.dispatch(error(msg));
			}
			else {
				this.props.dispatch(deleteObject(type, id));
                
                if (this.props.isDoc) {
                    this.props.dispatch(deleteDocument(id));
                }
			}
		});
	}
	
	onOpen() {
		if (this.props.isDoc) {
			// If document is encrypted, Document container will handle content loading
			// All we need to set is the type and id
			if (this.props.data.encrypted) {
				// Document container will require encryption key when
				// encrypted == true && encrypt == ""
				this.props.dispatch(loadDocument(
					Object.assign({}, this.props.data, { encrypt: "", theme: 6 })
				));
				return;
			}
		
			// Note document
			if (this.props.data.doc_type == 1) {
				this.props.socket.emit("get note object", this.props.data.doc_id, "", (err, res) => {
					if (err) {
						this.props.dispatch(error("Could not load note"));
					}
					else {
						this.props.dispatch(loadDocument(
							Object.assign({}, this.props.data, {
								content: buildNote(res.content, res.changes)
							})
						));
                        this.props.dispatch(initializeRenderObject());
					}
				});
			}
			// Other document
			else {
				this.props.socket.emit("get document content", this.props.data.doc_id, "", (err, res) => {
					if (err) {
						this.props.dispatch(error("Could not load document"));
					}
					else {
						this.props.dispatch(loadDocument(
							Object.assign({}, this.props.data, { content: res, theme: 6 })
						));
					}
				});
			}
		}
		else {
			this.props.dispatch(navigateToFolder(this.props.data.folder_id));
		}
	}

	render() {
		let icon = "", type, id;
        if (this.props.data === undefined) {
            return <div />;
        }
		else if (this.props.isDoc) {
			switch (this.props.data.doc_type) {
				case 1: icon = "nested-note"; break;
				case 2: icon = "doc-text"; break;
				case 3: icon = "file-code";
			}
            type = 2;
            id = this.props.data.doc_id; 
		}
		else {
			icon = "folder";
            type = 1;
            id = this.props.data.folder_id;
		}
    
		return (
			<div 
				className={"explorer-object-" + (this.props.isDoc ? "document" : "folder")}
				onMouseOver={this.onMouseOver} 
			>
				<span className={"icon-" + icon} style={{color: colors[this.props.data.color]}} />
				<span className="object-name" onClick={this.onOpen}>{this.props.data.name}</span>
				{
					(type == this.props.hover.objType && id == this.props.hover.id)
					? (
						<div className="object-controls">
							<span className="icon-edit" title="Rename" onClick={this.onRename} />
							<span className="icon-move" title="Move" onClick={this.onMove} />
							<span className="icon-trash" title="Delete" onClick={this.onDelete} />
						</div>
					)
					: (
						<span className="object-controls-hidden" />
					)
				}
			</div>
		);
	}

}