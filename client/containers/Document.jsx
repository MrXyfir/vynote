import React from "react";

// Components
import Page from "../components/documents/Page";
import Note from "../components/documents/Note";
import Code from "../components/documents/Code";

// Actions creators
import {
    accessError, loadContent, setEncryptionKey, openDocumentControls,
    toggleShowDocInfo
} from "../actions/documents/";
import { initializeRenderObject } from "../actions/documents/note";

// Modules
import getScopeParents from "../lib/explorer/scope-parents";
import buildNote from "../lib/note/build";

// Constants
import { syntaxes } from "../constants/editor";
import docTypes from "../constants/doc-types";

export default class Document extends React.Component {

    constructor(props) {
        super(props);
        
        this.onSetEncryptionKey = this.onSetEncryptionKey.bind(this);
        this.onOpenDocControls = this.onOpenDocControls.bind(this);
        this.onToggleDocInfo = this.onToggleDocInfo.bind(this);
    }

    onSetEncryptionKey() {
        let event = this.props.data.doc_type === 1 ? "get note object" : "get document content";
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
                if (this.props.data.doc_type === 1)
                    content = buildNote(content.content, content.changes, key);
                
                // Load content into state
                this.props.dispatch(loadContent(content));
                
                // Set state.document.render{} if note document
                if (this.props.data.doc_type === 1)
                    this.props.dispatch(initializeRenderObject());
                
                // Set document encryption key
                this.props.dispatch(setEncryptionKey(key));
            }
        });
    }
    
    onOpenDocControls() {
        this.props.dispatch(openDocumentControls());
    }
    
    onToggleDocInfo() {
        this.props.dispatch(toggleShowDocInfo());
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
            let view, info;
        
            switch (this.props.data.doc_type) {
                case 1:
                    view = (
                        <Note 
                            data={this.props.data} 
                            socket={this.props.socket} 
                            dispatch={this.props.dispatch} 
                            shortcuts={this.props.shortcuts}
                        />
                    ); break;
                case 2:
                    view = (
                        <Page 
                            data={this.props.data} 
                            socket={this.props.socket} 
                            dispatch={this.props.dispatch} 
                            shortcuts={this.props.shortcuts}
                        />
                    ); break;
                case 3:
                    view = (
                        <Code 
                            data={this.props.data} 
                            socket={this.props.socket} 
                            dispatch={this.props.dispatch} 
                            shortcuts={this.props.shortcuts}
                        />
                    ); break;
            }
            
            if (this.props.data.showInfo) {
                info = (
                    <table className="document-info">
                        <tr>
                            <th>Type</th><th>Name</th><th>Created</th><th>Folder</th><th></th>
                        </tr>
                        <tr>
                            <td className="type">{
                                docTypes[this.props.data.doc_type]
                            }</td>
                            <td className="name">{
                                this.props.data.name
                            }</td>
                            <td className="created">
                                {(new Date(this.props.data.created * 1000)).toLocaleString()}
                            </td>
                            <td className="folder">{
                                getScopeParents(this.props.folders, this.props.data.folder_id)
                                .map(folder => { return folder.name; })
                                .join("/") + "/" + this.props.folders[this.props.data.folder_id].name
                            }</td>
                            <td className="icons">
                                <span 
                                    className={this.props.data.contributor ? "icon-users" : ""}
                                    title={this.props.data.contributor ? "Multi-User Document" : ""}
                                />
                                <span 
                                    className={"icon-" + (this.props.data.encrypted ? "lock" : "unlocked")}
                                    title={this.props.data.encrypted ? "Encrypted" : "Unencrypted"} 
                                />
                            </td>
                        </tr>
                    </table>
                );
            }
            
            return (
                <div className="document-container">
                    <div className="document-head">
                        {info}
                        
                        <a onClick={this.onToggleDocInfo}>{
                            this.props.data.showInfo ? "Hide Info" : "Show Info"
                        }</a>
                        <a onClick={this.onOpenDocControls}>Document Controls</a>
                    </div>
                    
                    {view}
                </div>
            );
        }
    }

}