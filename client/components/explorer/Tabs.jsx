import React from "react";

// Action creators
import {
    createTab, closeAll, selectTab, closeTab, hoverTab, saveDocument
} from "actions/explorer/tabs";
import {
    loadDocument, loadContent, closeDocument
} from "actions/documents/index";
import { navigateToElement } from "actions/documents/note";
import { setView } from "actions/index";
import { error } from "actions/notification";

// Modules
import buildNote from "lib/note/build";

export default class Tabs extends React.Component {
    
    constructor(props) {
        super(props);
    }
    
    onNewTab() {
        // If a blank/new tab already exists, select it
        if (this.props.data.explorer.tabs.list['0'] !== undefined) {
            this.props.dispatch(selectTab(0));
            return;
        }
        
        // Free members limited to 2 tabs
        if (
            Object.keys(this.props.data.explorer.tabs.list).length == 2
            &&
            Date.now() > this.props.data.user.subscription
        ) {
            this.props.dispatch(error("Free members are limited to 2 tabs"));
            return;
        }
        
        // Save state.document to state.explorer.tabs.list[active].document
        if (this.props.data.explorer.tabs.active > 0) {
            this.props.dispatch(saveDocument(
                this.props.data.explorer.tabs.active,
                JSON.stringify(this.props.data.document)
            ));
            this.props.dispatch(closeDocument());
        }
        
        // Create/select new tab
        this.props.dispatch(createTab());
        this.props.dispatch(selectTab(0));
    }
    
    onCloseAll() {
        this.props.dispatch(closeDocument());
        this.props.dispatch(closeAll());
    }
    
    onSelectTab(id) {
        let active = this.props.data.explorer.tabs.active;

        // Change view if needed
        if (id > 0 && this.props.data.view == "explorer") {
            this.props.dispatch(setView("document"));
        }
        
        if (active != id) {
            // Save state.document to state.explorer.tabs.list[active].document
            this.props.dispatch(saveDocument(
                active, JSON.stringify(this.props.data.document)
            ));
            
            // Pull state.explorer.tabs.list[id].document and push to state.document
            // id == 0 is "New Tab" and has no document content
            if (id > 0) {
                this.props.dispatch(loadDocument(
                    JSON.parse(this.props.data.explorer.tabs.list[id].document)
                ));
                
                // A change was received while document was not active
                // All we need to do is update state.document.content
                if (this.props.data.explorer.tabs.list[id].reload) {
                    let obj = JSON.parse(this.props.data.explorer.tabs.list[id].document);
                    
                    // Note document
                    if (obj.doc_type == 1) {
                        this.props.socket.emit("get note object", obj.doc_id, obj.encrypt, (err, res) => {
                            if (err) {
                                this.props.dispatch(error("Could not load note"));
                            }
                            else {
                                this.props.dispatch(loadContent(buildNote(res.content, res.changes)));
                                this.props.directory(navigateToElement(obj.render.scope));
                            }
                        });
                    }
                    // Other document
                    else {
                        this.props.socket.emit("get document content", obj.doc_id, obj.encrypt, (err, res) => {
                            if (err)
                                this.props.dispatch(error("Could not load document"));
                            else
                                this.props.dispatch(loadContent(res));
                        });
                    }
                }
            }
            // Selecting blank tab
            else {
                this.props.dispatch(closeDocument());
            }
            
            // Select tab id
            this.props.dispatch(selectTab(id));
        }
    }
    
    onClose(id) {
        const tabs = Object.keys(this.props.data.explorer.tabs.list);

        // Closing active tab
        if (this.props.data.explorer.tabs.active == id) {
            // Select previous/next tab
            if (tabs.length > 1) {
                let index = 0;

                // Get tab's index in list
                tabs.forEach((tab, i) => { if (tab == id) index = i; });

                // Select previous tab
                if (index + 1 == tabs.length)
                    index -= 1;
                // Select next tab
                else
                    index += 1;
                
                // Select new tab and load document
                this.onSelectTab(tabs[index]);
                this.props.dispatch(closeTab(id));
            }
            // Make blank tab
            else {
                this.props.dispatch(closeDocument());
                this.props.dispatch(closeTab(id));
                this.props.dispatch(createTab());
                this.props.dispatch(selectTab(0));
            }
        }
        // Close non-active tab
        else {
            this.props.dispatch(closeTab(id));
        }
    }
    
    render() {
        return (
            <div className="tabs">
                <div className="tabs-bar">
                    <span className="title">Active Documents</span>
                    
                    {this.props.data.view == "explorer"
                    && this.props.data.document.doc_id ? (
                        <span
                            className="icon-right"
                            onClick={() => this.props.dispatch(setView("document"))}
                            title="View Active Document"
                        />
                    ) : (
                        <span />
                    )}
                    <span
                        className="icon-add"
                        onClick={() => this.onNewTab()}
                        title="New Tab"
                    />
                    <span
                        className="icon-close"
                        onClick={() => this.onCloseAll()}
                        title="Close All Tabs"
                    />
                </div>
                
                <div className="list">{
                    Object.keys(this.props.data.explorer.tabs.list).map(tab => {
                        return (
                            <div
                                onClick={this.onSelectTab.bind(this, tab)}
                                className={
                                    "tab" + (tab == this.props.data.explorer.tabs.active ? " active" : "")
                                }
                                onMouseOut={() => this.props.dispatch(hoverTab(-1))}
                                onMouseOver={() => this.props.dispatch(hoverTab(tab))}
                            >
                                {tab == this.props.data.explorer.tabs.hover ? (
                                    <span
                                        className="icon-close"
                                        onClick={this.onClose.bind(this, tab)}
                                    />
                                ) : (
                                    <span className="icon-close-hidden" />
                                )}
                                
                                <span className="name">{
                                    this.props.data.explorer.tabs.list[tab].name
                                }</span>
                                <span className="directory">{
                                    this.props.data.explorer.tabs.list[tab].directory
                                }</span>
                            </div>
                        );
                    })
                }</div>
            </div>
        )
    }
    
}