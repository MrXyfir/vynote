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
import {
    createTab, selectTab, changeDocument
} from "../../actions/explorer/tabs";
import { initializeRenderObject } from "../../actions/documents/note";

// Constants
import colors from "../../constants/colors";

// Modules
import getParents from "../../lib/explorer/scope-parents";
import buildNote from "../../lib/note/build";

export default class ExplorerObject extends React.Component {

	constructor(props) {
		super(props);
        
        this.onMouseOver = this.onMouseOver.bind(this);
        this.onMouseOut = this.onMouseOut.bind(this);
        this.onRename = this.onRename.bind(this);
        this.onDelete = this.onDelete.bind(this);
        this.onMove = this.onMove.bind(this);
        this.onOpen = this.onOpen.bind(this);
	}

    onMouseOver() {
        this.props.dispatch(hoverObject(this.props.type, this.props.id));
    }
    
    onMouseOut() {
        this.props.dispatch(hoverObject(0, 0));
    }

	onRename() {
		this.props.dispatch(triggerRenameObject(this.props.type, this.props.id));
	}
	
	onMove() {
		this.props.dispatch(triggerMoveObject(this.props.type, this.props.id));
	}
	
	onDelete() {
		let type = this.props.type, id = this.props.id;
		
		this.props.socket.emit("delete object", type, id, (err, msg) => {
			if (err) {
				this.props.dispatch(error(msg));
			}
			else {
				this.props.dispatch(deleteObject(type, id));
                
                if (this.props.type == 2) {
                    this.props.dispatch(deleteDocument(id));
                    
                    if (this.props.data.explorer.tabs.list[id]) {
                        this.props.dispatch(changeDocument(id, 0, "Blank Tab", ""));
                        this.props.dispatch(selectTab(0));
                    }
                }
			}
		});
	}
	
	onOpen() {
        let obj = this.props.data.explorer[this.props.group][this.props.id];
        
		if (this.props.type == 2) {
            // Create a new tab if none are available
            if (!Object.keys(this.props.data.explorer.tabs.list).length) {
                this.props.dispatch(createTab());
                this.props.dispatch(selectTab(0));
            }
            
            // Replace id/name/directory in active tab with current doc's info
            this.props.dispatch(changeDocument(
                this.props.data.explorer.tabs.active,
                obj.doc_id, obj.name,
                getParents(
                    this.props.data.explorer.folders, obj.folder_id
                ).map(folder => { return folder.name; }).join("/")
                + "/" + this.props.data.explorer.folders[obj.folder_id].name
            ));
            
            // Select the new tab
            this.props.dispatch(selectTab(obj.doc_id));
            
			// If document is encrypted, Document container will handle content loading
			// All we need to set is the type and id
			if (obj.encrypted) {
				// Document container will require encryption key when
				// encrypted == true && encrypt == ""
                let data = Object.assign({}, obj, {
                    encrypt: "", theme: this.props.data.user.config.defaultEditorTheme
                });
                
                if (obj.doc_type == 2)
                    data.preview = this.props.data.user.config.defaultPageView == "preview";
                
				this.props.dispatch(loadDocument(data));
				return;
			}
		
			// Note document
			if (obj.doc_type == 1) {
				this.props.socket.emit("get note object", obj.doc_id, "", (err, res) => {
					if (err) {
						this.props.dispatch(error("Could not load note"));
					}
					else {
						this.props.dispatch(loadDocument(
							Object.assign({}, obj, {
								content: buildNote(res.content, res.changes)
							})
						));
                        this.props.dispatch(initializeRenderObject());
					}
				});
			}
			// Other document
			else {
				this.props.socket.emit("get document content", obj.doc_id, "", (err, res) => {
					if (err) {
						this.props.dispatch(error("Could not load document"));
					}
					else {
                        let data = Object.assign({}, obj, {
                            content: res, theme: this.props.data.user.config.defaultEditorTheme
                        });
                        
                        if (obj.doc_type == 2)
                            data.preview = this.props.data.user.config.defaultPageView == "preview";
                        
						this.props.dispatch(loadDocument(data));
					}
				});
			}
		}
		else {
			this.props.dispatch(navigateToFolder(obj.folder_id));
		}
	}

	render() {
		let icon = "", type = this.props.type, id = this.props.id;
        
        if (this.props.data === undefined) return <div />;
        
        let obj = this.props.data.explorer[this.props.group][this.props.id];
        if (obj === undefined) return <div />;
        
		if (this.props.type == 2) {
			switch (obj.doc_type) {
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
				className={"explorer-object-" + (this.props.type == 2 ? "document" : "folder")}
                onMouseOut={this.onMouseOut}
				onMouseOver={this.onMouseOver} 
			>
				<span className={"icon-" + icon} style={{color: colors[obj.color]}} />
				<span className="object-name" onClick={this.onOpen}>{obj.name}</span>
				{
					(type == this.props.data.explorer.hover.objType && id == this.props.data.explorer.hover.id)
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