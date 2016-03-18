import React from "react";

// React components
import FilterControls from "./note/FilterControls";
import Elements from "./note/Elements";
import Parents from "./note/Parents";

// Action creators
import {
    addElement, editElement, navigateToElement, deleteElement, toggleShowChildren
} from "../../actions/documents/note";
import { error } from "../../actions/notification";

// Modules
import generateID from "../../lib/note/generate-id";

export default class Note extends React.Component {
    
    constructor(props) {
        super(props);
        
        this._bindKeyboardShortcuts = this._bindKeyboardShortcuts.bind(this);
        this.onAddElement = this.onAddElement.bind(this);
    }
    
    onAddElement() {
        let id = generateID(this.props.data.content); 
        
        this.props.dispatch(addElement(
            this.props.data.render.scope, id
        ));
        this.props.dispatch(editElement(id))
    }
    
    _unbindKeyboardShortcuts() {
        Mousetrap.unbind([
            "tab", "shift+tab", "alt+left", "alt+right", "alt+c",
            "alt+enter", "alt+del", "ctrl+f"
        ]);
    }
    
    _bindKeyboardShortcuts() {
        // Move element being edited into older sibling's children
        Mousetrap.bind("tab", (e) => {
            let el = this.props.data.render.editing;
            
            if (el) {
                let parent  = this.props.data.content[el].parent;
                let sibling = this.props.data.content[parent].children.indexOf(el - 1);
                
                if (sibling) {
                    let data = {
                        doc: this.props.data.doc_id, action: "MOVE", id: el, index: -1
                    };
                    
                    this.props.socket.emit("change note element", data, (err, res) => {
                        if (err)
                            this.props.dispatch(error(res));
                        else
                            this.props.dispatch(moveElement(el, sibling));
                    });
                }
            }
        });
        
        // Move element being edited into grandparent's children
        Mousetrap.bind("shift+tab", (e) => {
            let el = this.props.data.render.editing;
            
            if (el) {
                let parent  = this.props.data.content[el].parent;
                let gparent = this.props.data.content[parent].parent;
                
                if (gparent) {
                    let index = this.props.data.content[gparent].children.indexOf(parent) + 1;
                    
                    let data = {
                        doc: this.props.data.doc_id, action: "MOVE", id: el, index
                    };
                    
                    this.props.socket.emit("change note element", data, (err, res) => {
                        if (err)
                            this.props.dispatch(error(res));
                        else
                            this.props.dispatch(moveElement(el, gparent, index));
                    });
                }
            }
        });
        
        // Change scope to parent
        Mousetrap.bind("alt+left", (e) => {
            let parent = this.props.data.content[this.props.data.render.editing].parent;
            
            if (parent) this.props.dispatch(navigateToElement(parent));
        });
        
        // Change scope to element being edited
        Mousetrap.bind("alt+right", (e) => {
            if (this.props.data.render.editing)
                this.props.dispatch(navigateToElement(this.props.data.render.editing))
        });
        
        // Toggle show element's children
        Mousetrap.bind("alt+c", (e) => {
            let el = this.props.data.render.editing;
            
            if (el) this.props.dispatch(toggleShowChildren(el));
        });
        
        // Delete element and its children
        Mousetrap.bind("alt+del", (e) => {
            let el = this.props.data.render.editing;
            
            if (el) {
                if (this.props.data.content[el].create) {
                    this.props.dispatch(deleteElement(el));
                }
                else {
                    let data = {
                        doc: this.props.data.doc_id, action: "DELETE", id: el
                    };
                    
                    this.props.socket.emit("change note element", data, (err, res) => {
                        if (err)
                            this.props.dispatch(error(res));
                        else
                            this.props.dispatch(deleteElement(el));
                    });
                }
            }
        });
        
        // Create child element
        Mousetrap.bind("alt+enter", (e) => {
            let id = generateID(this.props.data.content);
            let el = this.props.data.render.editing;
            
            if (!el) return;
        
            this.props.dispatch(addElement(el, id));
            
            if (this.props.data.render.showChildren.indexOf(el) == -1) {
                this.props.dispatch(toggleShowChildren(el));
            }
            
            this.props.dispatch(editElement(id));
        });
        
        // Focus on search box
        Mousetrap.bind("ctrl+f", (e) => {
            document.querySelector(".note-filter-controls > input").focus();
        });
    }
    
    render() {
        if (this.props.data.render === undefined) {
            return <div />;
        }
        
        return (
            <div className="document-note">
                <FilterControls data={this.props.data} dispatch={this.props.dispatch} />
                <Parents dispatch={this.props.dispatch} data={this.props.data} />
                
                <div className="note-scoped-element">
                    <span 
                        title="Add Child"
                        onClick={this.onAddElement}
                        className="icon-add"  
                    />
                    <span className="content">{
                        this.props.data.content[this.props.data.render.scope].content.length > 53
                        ? this.props.data.content[this.props.data.render.scope].content.substr(0, 50) + "..."
                        : this.props.data.content[this.props.data.render.scope].content
                    }</span>
                </div>
                
                <Elements
                    data={this.props.data} 
                    socket={this.props.socket} 
                    scope={this.props.data.render.scope} 
                    dispatch={this.props.dispatch}
                />
            </div>
        );
    }
    
}