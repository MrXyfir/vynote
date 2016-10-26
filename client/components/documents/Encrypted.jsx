import React from "react";

// Actions creators
import {
    accessError, loadContent, setEncryptionKey
} from "actions/documents/index";
import { initializeRenderObject } from "actions/documents/note";

// Modules
import updateContent from "lib/../../lib/document/update";
import buildNote from "lib/note/build";

export default class EncryptedDocument extends React.Component {
	
	constructor(props) {
		super(props);
	}

    onSetEncryptionKey() {
        let event = this.props.data.document.doc_type === 1
            ? "get note object" : "get document content";
        let key = this.refs.key.value;
        
        // Attempt to load document's content with type/id/key
        this.props.socket.emit(
            event, this.props.data.document.doc_id, key,
            (err, content) => {
                if (err) {
                    this.props.dispatch(accessError());
                    
                    this.refs.key.value = "";
                    this.refs.key.focus();
                }
                // Load content into state and set encryption key
                else {
                    // Build content object/string and merge changes
                    if (this.props.data.document.doc_type === 1) {
                        content = buildNote(content.content, content.changes, key);
                    }
                    else {
                        let changes = [];
                        content.changes.forEach(change => {
                            changes = changes.concat(
                                JSON.parse(change.change_object).changes
                            );
                        });
                        
                        content = updateContent(content.content, changes);
                    }
                    
                    // Load content into state
                    this.props.dispatch(loadContent(content));
                    
                    // Set state.document.render{} if note document
                    if (this.props.data.document.doc_type === 1)
                        this.props.dispatch(initializeRenderObject());
                    
                    // Set document encryption key
                    this.props.dispatch(setEncryptionKey(key));
                }
            }
        );
    }
	
	render() {
		return (
            <div className="document document-encrypted">
                <h3>Encryption Key</h3>
                <p>Enter in this document's encryption key to gain access.</p>
                
                <input type="text" ref="key" placeholder="Key" />
                <button
                    className="btn-primary"
                    onClick={() => this.onSetEncryptionKey()}
                >
                    Access Document
                </button>
            </div>
        );
	}
	
}