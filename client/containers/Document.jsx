import { Component } from "react";

import Page from "../components/documents/Page";
import Note from "../components/documents/Note";
import Code from "../components/documents/Code";

import { accessError, loadContent, setEncryptionKey } from "../actions/documents/";

import toNoteObject from "../../lib/notes-convert/to-object";

export default class Document extends Component {

    onSetEncryptionKey() {
        let event = this.props.data.type === 1 ? "get note elements" : "get document content";
        let key = this.refs.key.value;
        
        // Attempt to load document's content with type/id/key
        this.props.emit(event, this.props.data.id, key, (err, content) => {
            if (err) {
                this.props.dispatch(accessError());
                
                this.refs.key.value = "";
                this.refs.key.focus();
            }
            // Load content into state and set encryption key
            else {
                // Convert content to note object
                if (this.props.data.type === 1) {
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

    render() {
        // Document is encrypted and user has not provided key
        if (this.props.data.encrypted && this.props.data.encrypt === "") {
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
            switch (this.props.data.type) {
                case 1:
                    return <Note data={this.props.data} emit={this.props.emit} dispatch={this.props.dispatch}></Note>;
                case 2:
                    return <Page data={this.props.data} emit={this.props.emit} dispatch={this.props.dispatch}></Page>;
                case 3:
                    return <Code data={this.props.data} emit={this.props.emit} dispatch={this.props.dispatch}></Code>;
            }
        }
    }

}