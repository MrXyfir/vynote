import { Component } from "react";

// Action creators
import {
	triggerRenameObject, triggerMoveObject
} from "../../actions/explorer/user-input";
import { error } from "../../actions/notification";
import { navigateToFolder, deleteObject } from "../../actions/explorer/";
import { loadDocument } from "../../actions/document/";

// Constants
import colors from "../../constants/colors";

// Modules
import buildNoteObject from "../../../lib/notes-convert/to-object";

export default class ExplorerObject extends Component {

	constructor(props) {
		super(props);
		
		this.state = { showControls: false };
	}
	
	onMouseOver() {
		this.setState({ showControls: true });
	}
	
	onMouseOut() {
		this.setState({ showControls: false });
	}

	onRename() {
		triggerRenameObject(
			(this.props.isDoc ? 2 : 1),
			this.props.data[this.props.isDoc ? "doc_id" : "folder_id"]
		);
	}
	
	onMove() {
		triggerMoveObject(
			(this.props.isDoc ? 2 : 1),
			this.props.data[this.props.isDoc ? "doc_id" : "folder_id"]
		);
	}
	
	onDelete() {
		let type = this.props.isDoc ? 2 : 1;
		let id = this.props.data[type == 2 ? "doc_id" : "folder_id"]
		
		this.props.emit("delete object", type, id, (err, msg) => {
			if (err) {
				this.dispatch(error(msg));
			}
			else {
				this.dispatch(deleteObject(type, id));
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
				this.dispatch(loadDocument(
					Object.assign({}, this.props.data, { encrypt: "" }
				);
				return;
			}
		
			// Note document
			if (this.props.data.doc_type == 1) {
				this.props.emit("get note elements", this.props.data.doc_id, "", (err, res) => {
					if (err) {
						this.dispatch(error("Could not load note"));
					}
					else {
						this.dispatch(loadDocument(
							Object.assign({}, this.props.data, {
								content: buildNoteObject(res)
							}
						));
					}
				});
			}
			// Other document
			else {
				this.props.emit("get document content", this.props.data.doc_id, "", (err, res) => {
					if (err) {
						this.dispatch(error("Could not load document"));
					}
					else {
						this.dispatch(loadDocument(
							Object.assign({}, this.props.data, { content: res })
						);
					}
				});
			}
		}
		else {
			this.dispatch(navigateToFolder(this.props.data.folder_id));
		}
	}

	render() {
		let icon = "";
		if (this.props.isDoc) {
			switch (this.props.data.doc_type) {
				case 1: icon = "nested-note"; break;
				case 2: icon = "doc-text"; break;
				case 3: icon = "file-code";
			}
		}
		else {
			icon = "folder";
		}
	
		return (
			<div 
				className={"explorer-object-" + (this.props.isDoc ? "document" : "folder")}
				onMouseOver={this.onMouseOver} onMouseOut={this.onMouseOut} 
			>
				<span className={"icon-" + icon} style={{color: colors[this.props.data.color]}} />
				<span className="object-name" onClick={this.props.onOpen}>{this.props.data.name}</span>
				{
					this.state.showControls
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