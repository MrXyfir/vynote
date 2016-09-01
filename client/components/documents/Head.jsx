import React from "react";

// Actions creators
import {
    openDocumentControls, closeDocument
} from "actions/documents/index";
import { togglePreview } from "actions/documents/page";
import { changeDocument, selectTab } from "actions/explorer/tabs";
import { toggleShowEditorSettings } from "actions/documents/code";

export default class Head extends React.Component {
    
    constructor(props) {
        super(props);
    }
    
    onClose() {
        this.props.dispatch(changeDocument(
            this.props.data.document.doc_id,
            0, "Blank Tab", ""
        ));
        this.props.dispatch(closeDocument());
        this.props.dispatch(selectTab(0));
    }
    
    render() {
        if (this.props.data.document.doc_id === 0) {
            return <div />;
        }
        if (!this.props.data.explorer.tabs.list[this.props.data.document.doc_id]) {
            return <div />;
        }
        
        return (
            <div className="document-head">
                <div className="info">
                    <span className="name">{this.props.data.document.name}</span>
                    <span className="directory">{
                        this.props.data.explorer.tabs.list[
                            this.props.data.document.doc_id
                        ].directory
                    }</span>
                    
                    <div className="icons">
                        <span
                            title={(
                                this.props.data.document.doc_type == 1
                                ? "Nested Note"
                                : this.props.data.document.doc_type == 2
                                    ? "Page" : "Code"
                            ) + " Document"}
                            className={"icon-" + (
                                this.props.data.document.doc_type == 1
                                ? "nested-note"
                                : this.props.data.document.doc_type == 2
                                    ? "doc-text" : "file-code"
                            )}
                        />
                        <span
                            title="Multi-User Document"
                            className={this.props.data.document.contributor ? "icon-users" : ""}
                        />
                        <span
                            title={this.props.data.document.encrypted ? "Encrypted" : "Unencrypted"}
                            className={"icon-" + (this.props.data.document.encrypted ? "lock" : "unlocked")}
                        />
                    </div>
                </div>
                <div className="controls">
                    <span
                        title="Open Document Controls"
                        onClick={() => this.props.dispatch(openDocumentControls())}
                        className="icon-controls"
                    />
                    {
                        this.props.data.document.doc_type == 2
                        ? (
                            <span
                                title={"Switch to " + (
                                    this.props.data.document.preview ? "Edit" : "Preview"
                                ) + " Mode"}
                                onClick={() => this.props.dispatch(togglePreview())}
                                className={"icon-" + (
                                    this.props.data.document.preview ? "edit" : "view"
                                )}
                            />
                        ) : <span />
                    }
                    {
                        this.props.data.document.doc_type == 3
                        ? (
                            <span
                                title="Editor Settings"
                                onClick={() => this.props.dispatch(toggleShowEditorSettings())}
                                className="icon-settings"
                            />
                        ) : <span />
                    }
                    <span
                        title="Close Document"
                        onClick={this.onClose.bind(this)}
                        className="icon-close"
                    />
                </div>
            </div>
        );
    }
    
}