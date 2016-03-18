import React from "react";

// Action creators
import {
    toggleShowChildren, navigateToElement, showElementControls,
    setElementFlags, addElement, deleteElement, editElement,
    hoverElement
} from "../../../actions/documents/note";
import { error } from "../../../actions/notification";

// Constants
import flags from "../../../constants/flags";

// Modules
import generateID from "../../../lib/note/generate-id";

export default class ElementControls extends React.Component {
    
    constructor(props) {
        super(props);
        
        this.onCloseExtendedControls = this.onCloseExtendedControls.bind(this);
        this.onShowExtendedControls = this.onShowExtendedControls.bind(this);
        this.onToggleShowChildren = this.onToggleShowChildren.bind(this);
        this.onScopeToElement = this.onScopeToElement.bind(this);
        this.onMouseOver = this.onMouseOver.bind(this);
        this.onMouseOut = this.onMouseOut.bind(this);
        this.onAddChild = this.onAddChild.bind(this);
        this.onDelete = this.onDelete.bind(this);
    }
    
    onMouseOver() {
        this.props.dispatch(hoverElement(this.props.id));
    }
    
    onMouseOut() {
        this.props.dispatch(hoverElement(""));
    }
    
    onShowExtendedControls(e) {
        e.preventDefault();
        this.props.dispatch(showElementControls(this.props.id));
    }
    
    onCloseExtendedControls() {
        let changed = false;
        
        // Check if element's flags have been changed
        flags.forEach((flag, i) => {
            let oldF = this.props.data.content[this.props.id].flags.indexOf(i) > -1;
            let newF = this.refs[`flag-${i}`].checked;
            
            if (oldF !== newF) changed = true;
        });
        
        // Update element's flags
        if (changed && !this.props.data.content[this.props.id].create) {
            let data = {
                action: "SET_FLAGS", doc: this.props.data.document.doc_id,
                id: this.props.id, content: flags.map((flag, i) => {
                    return this.refs[`flag-${i}`].checked;
                }).filter(val => { return val; })
            };
            
            this.props.socket.emit("change note element", data, (err, res) => {
                if (err) {
                    this.props.dispatch(error(res));
                }
                else {
                    this.props.dispatch(setElementFlags(
                        this.props.id, data.flags
                    ));
                }
                
                this.props.dispatch(showElementControls(""));
            });
        }
        else {
            this.props.dispatch(showElementControls(""));
        }
    }
    
    onToggleShowChildren() {
        this.props.dispatch(toggleShowChildren(this.props.id));
    }
    
    onScopeToElement() {
        this.props.dispatch(navigateToElement(this.props.id));
    }
    
    onAddChild() {
        if (this.props.data.content[this.props.id].create) {
            this.props.dispatch(error(
                "You cannot create a child on an element with no content"
            ));
            return;
        }
        
        let id = generateID(this.props.data.content);
        
        // Create child element
        this.props.dispatch(addElement(this.props.id, id));
        
        // Show current element's children
        if (this.props.data.render.showChildren.indexOf(this.props.id) == -1) {
            this.props.dispatch(toggleShowChildren(this.props.id));
        }
        
        // Set child element editing
        this.props.dispatch(editElement(id));
    }
    
    onDelete() {
        // Element was only created locally
        if (this.props.data.content[this.props.id].create) {
            this.props.dispatch(deleteElement(this.props.id));
        }
        else {
            let data = {
                doc: this.props.data.doc_id, action: "DELETE", id: this.props.id
            };
            
            this.props.socket.emit("change note element", data, (err, res) => {
                if (err)
                    this.props.dispatch(error(res));
                else
                    this.props.dispatch(deleteElement(data.id));
            });
        }
    }
    
    render() {
        return (
            <div 
                className="note-controls" 
                onMouseOver={this.onMouseOver}
                onMouseOut={this.onMouseOut} 
            >
                { // Output 'Show Children' toggle if element is being hovered
                    (
                        this.props.id == this.props.data.render.hovering
                        &&
                        this.props.data.content[this.props.id].children.length > 0
                    )
                    ? (
                        this.props.data.render.showChildren.indexOf(this.props.id) > -1
                        ? (
                            <span 
                                title="Hide Children"
                                onClick={this.onToggleShowChildren} 
                                className="toggle-show-children hide" 
                            >-</span>
                        )
                        : (
                            <span 
                                title="Show Children"
                                onClick={this.onToggleShowChildren} 
                                className="toggle-show-children show" 
                            >+</span>
                        )
                    )
                    : (
                        <span className="toggle-show-children" />
                    )
                }
                <span
                    title="Scope to Element"  
                    onClick={this.onScopeToElement}
                    className={
                        (this.props.id == this.props.data.render.controls)
                        ? "icon-circle highlight" : "icon-circle-outline"
                    } 
                    onContextMenu={this.onShowExtendedControls} 
                />
                
                { // Optionally render extended controls
                    this.props.id == this.props.data.render.controls
                    ? (
                        <div className="controls-extended">
                            <span 
                                title="Close Controls"
                                onClick={this.onCloseExtendedControls} 
                                className="icon-close" 
                            />
                            <span onClick={this.onDelete}>Delete</span>
                            <span onClick={this.onAddChild}>Add Child</span>
                            <div className="flags">{
                                flags.map((flag, i) => {
                                    return (
                                        <div className="flag">
                                            <input 
                                                ref={`flag-${i}`} 
                                                type="checkbox" 
                                                defaultChecked={
                                                    this.props.data.content[this.props.id].flags.indexOf(i) > -1
                                                } 
                                            />
                                            <span>{flag}</span>
                                        </div>
                                    );
                                })
                            }</div>
                        </div>
                    )
                    : (
                        <span className="hidden" />
                    )
                }
            </div>
        );
    }
    
}