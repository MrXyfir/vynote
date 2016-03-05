import React from "react";

// Components
import Page from "../components/documents/Page";
import Note from "../components/documents/Note";
import Code from "../components/documents/Code";

// Actions creators
import {
    accessError, loadContent, setEncryptionKey, openDocumentControls
} from "../actions/documents/";

// Modules
import toNoteObject from "../../lib/notes-convert/to-object";
import getScopeParents from "../lib/explorer/scope-parents";

// Constants
import { syntaxes } from "../constants/editor";

export default class Document extends React.Component {

    onSetEncryptionKey() {
        let event = this.props.data.doc_type === 1 ? "get note elements" : "get document content";
        let key = this.refs.key.value;
        
        // Attempt to load document's content with type/id/key
        this.props.socket.emit(event, this.props.data.doc_id, key, (err, content) => {
            if (err) {
                this.props.dispatch(accessError());
                
                this.refs.key.value = "";
                this.refs.key.focus();
            }
            // Load content into state and set encryption key
            else {
                // Convert content to note object
                if (this.props.data.doc_type === 1) {
                    content = toNoteObject(content);
                    content.scope = 0;
                }
                
                // Load content into state
                this.props.dispatch(loadContent(content));
                
                // Set document encryption key
                this.props.dispatch(setEncryptionKey(key));
            }
        });
    }
    
    onOpenDocControls() {
        this.props.dispatch(openDocumentControls());
    }

    render() {
        if (this.props.data.doc_type == 0) {
            return <div />;
        }
        // Document is encrypted and user has not provided key
        else if (this.props.data.encrypted && this.props.data.encrypt === "") {
            return (
                <div className="document-encrypted">
                    <h3>Encryption Key</h3>
                    <p>Enter in this document's encryption key to gain access.</p>
                    
                    <input type="text" ref="key" />
                    <button className="btn-primary" onClick={this.onSetEncryptionKey}>
                        Access Document
                    </button>
                </div>
            );
        }
        // Output appropriate component to handle document
        else {
            let view;
        
            switch (this.props.data.doc_type) {
                case 1:
                    view = <Note data={this.props.data} socket={this.props.socket} dispatch={this.props.dispatch} />;
                    break;
                case 2:
                    view = <Page data={this.props.data} socket={this.props.socket} dispatch={this.props.dispatch} />;
                    break;
                case 3:
                    view = <Code data={this.props.data} socket={this.props.socket} dispatch={this.props.dispatch} />;
            }
            
            return (
                <div className="document-container">
                    <div className="document-head">
                        <div className="document-info">
                            <span title="Document Type">[
                                {this.props.data.doc_type == 1 ? "Note" : (this.props.data.doc_type == 2 ? "Page" : "Code")}
                            ]</span>
                            {" - "}
                            <span title="Document Name">[
                                {this.props.data.name}
                            ]</span>
                            {" - "}
                            <span title="Created">[
                                {(new Date()).toLocaleString(this.props.data.created)}
                            ]</span> 
                        </div>
                        <div className="document-icons">
                            <span 
                                className={this.props.data.contributor ? "icon-users" : ""}
                                title={this.props.data.contributor ? "Multi-User Document" : ""}
                            />
                            <span 
                                className={"icon-" + (this.props.data.encrypted ? "lock" : "unlocked")}
                                title={this.props.data.encrypted ? "Encrypted" : "Unencrypted"} 
                            />
                        </div>
                        <div className="document-location">{
                            getScopeParents(this.props.folders, this.props.data.folder_id)
                                .map(folder => {
                                    return folder.name;
                                }).join("/") + "/" + this.props.folders[this.props.data.folder_id].name
                        }</div>
                        <a onClick={this.onOpenDocControls}>Document Controls</a>
                    </div>
                    
                    {view}
                </div>
            );
        }
    }

}