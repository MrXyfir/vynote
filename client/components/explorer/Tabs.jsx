import React from "react";

// Action creators
import {
    createTab, closeAll, selectTab, closeTab, hoverTab, saveDocument
} from "../../actions/explorer/tabs";
import {
    loadDocument, loadContent
} from "../../actions/documents/";
import { navigateToElement } from "../../actions/documents/note";
import { error } from "../../actions/notification";

// Modules
import buildNote from "../../lib/note/build";

export default class Tabs extends React.Component {
    
    constructor(props) {
        super(props);
        
        this.props.onNewTab = this.props.onNewTab.bind(this);
        this.onCloseAll = this.props.onCloseAll.bind(this);
    }
    
    onNewTab() {
        if (this.props.data.explorer.tabs.list.length == 2 && Date.now() > this.props.data.user.subscription) {
            this.props.dispatch(error("Free members are limited to 2 tabs"));
            return;
        }
        
        this.props.dispatch(createTab());
        this.props.dispatch(selectTab(0));
    }
    
    onCloseAll() {
        this.props.dispatch(closeAll());
    }
    
    onSelectTab(id) {
        let active = this.props.data.explorer.tabs.active;
        
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
            
            // Select tab id
            this.props.dispatch(selectTab(id));
        }
    }
    
    onClose(id) {
        this.props.dispatch(closeTab(id));
    }
    
    onMouseOver(id) {
        this.props.dispatch(hoverTab(id));
    }
    
    onMouseOut() {
        this.props.dispatch(hoverTab(-1));
    }
    
    render() {
        return (
            <div className="tabs">
                <div className="tabs-bar">
                    <span className="title">Active Documents</span>
                    <span className="icon-add" title="New Tab" onClick={this.onNewTab} />
                    <span className="icon-close" title="Close All Tabs" onClick={this.onCloseAll} />
                </div>
                
                <div className="list">{
                    Object.keys(this.props.data.explorer.tabs.list).map(tab => {
                        return (
                            <div
                                onClick={this.onSelectTab.bind(this, tab)}
                                className={
                                    "tab" + (tab == this.props.data.explorer.tabs.active ? " active" : "")
                                }
                                onMouseOut={this.onMouseOut}
                                onMouseOver={this.onMouseOver.bind(this, tab)}
                            >
                                {
                                    tab == this.props.data.explorer.tabs.hover
                                    ? <span className="icon-close" onClick={this.onClose.bind(this, tab)} />
                                    : <span />
                                }
                                
                                <span className="name">{this.props.data.explorer.tabs.list[tab].name}</span>
                                <span className="directory">{this.props.data.explorer.tabs.list[tab].directory}</span>
                            </div>
                        );
                    })
                }</div>
            </div>
        )
    }
    
}