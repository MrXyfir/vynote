import React from "react";

// Components
import Page from "../components/documents/Page";
import Note from "../components/documents/Note";
import Code from "../components/documents/Code";
import Head from "../components/documents/Head";

// Actions creators
import {
    accessError, loadContent, setEncryptionKey
} from "../actions/documents/";
import { initializeRenderObject } from "../actions/documents/note";

// Modules
import updateContent from "../../lib/document/update";
import buildNote from "../lib/note/build";

export default class Document extends React.Component {

    constructor(props) {
        super(props);
        
        this.onSetEncryptionKey = this.onSetEncryptionKey.bind(this);
    }

    onSetEncryptionKey() {
        let event = this.props.data.document.doc_type === 1 ? "get note object" : "get document content";
        let key = this.refs.key.value;
        
        // Attempt to load document's content with type/id/key
        this.props.socket.emit(event, this.props.data.document.doc_id, key, (err, content) => {
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
                    res.changes.forEach(change => {
                        changes = changes.concat(JSON.parse(change.change_object).changes);
                    });
                    
                    content = updateContent(res.content, changes);
                }
                
                // Load content into state
                this.props.dispatch(loadContent(content));
                
                // Set state.document.render{} if note document
                if (this.props.data.document.doc_type === 1)
                    this.props.dispatch(initializeRenderObject());
                
                // Set document encryption key
                this.props.dispatch(setEncryptionKey(key));
            }
        });
    }

    render() {
        if (this.props.data.document.doc_type == 0) {
            return <div />;
        }
        // Document is encrypted and user has not provided key
        else if (this.props.data.document.encrypted && this.props.data.document.encrypt === "") {
            return (
                <div className="document-container">
                    <div className="document-encrypted">
                        <h3>Encryption Key</h3>
                        <p>Enter in this document's encryption key to gain access.</p>
                        
                        <input type="text" ref="key" placeholder="Key" />
                        <button className="btn-primary" onClick={this.onSetEncryptionKey}>
                            Access Document
                        </button>
                    </div>
                </div>
            );
        }
        // Output appropriate component to handle document
        else {
            let view;
        
            switch (this.props.data.document.doc_type) {
                case 1:
                    view = (
                        <Note
                            user={this.props.data.user}
                            data={this.props.data.document}
                            socket={this.props.socket} 
                            dispatch={this.props.dispatch} 
                        />
                    ); break;
                case 2:
                    view = (
                        <Page
                            user={this.props.data.user}
                            data={this.props.data.document}
                            socket={this.props.socket} 
                            dispatch={this.props.dispatch} 
                        />
                    ); break;
                case 3:
                    view = (
                        <Code
                            user={this.props.data.user}
                            data={this.props.data.document}
                            socket={this.props.socket}
                            dispatch={this.props.dispatch}
                        />
                    ); break;
            }
            
            return (
                <div className="document-container">
                    <Head
                        data={this.props.data}
                        socket={this.props.socket}
                        dispatch={this.props.dispatch}
                    />
                    {view}
                </div>
            );
        }
    }

}