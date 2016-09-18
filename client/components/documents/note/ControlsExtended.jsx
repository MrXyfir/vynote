import React from "react";

// Action creators
import {
    toggleShowChildren, setElementFlags, addElement, deleteElement, editElement
} from "actions/documents/note";
import { error } from "actions/notification";

// Constants
import flags from "constants/flags";

// Modules
import { tab, shiftTab } from "lib/note/kbe-handlers";
import generateID from "lib/note/generate-id";

export default class ElementControlsExtended extends React.Component {
    
    constructor(props) {
        super(props);

        this.state = { showFlags: false };
    }
    
    onToggleShowFlags() {
        if (!this.state.showFlags) {
            this.setState({ showFlags: true });
        }
        else {
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
            
            this.setState({ showFlags: false });
        }
    }
    
    onAddChild() {
        if (this.props.data.content[this.props.id].create) {
            this.props.dispatch(error(
                "You cannot create a child on an element with no content"
            )); return;
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
        this.props.dispatch(showElementControls(""));
        
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
            <div className="note-controls-extended">
                <a
                    className="icon-add"
                    onClick={() => this.onAddChild()}
                    title="Add Child"
                />
                <a
                    className="icon-trash"
                    onClick={() => this.onDelete()}
                    title="Delete Element and Children"
                />
                <a
                    className="icon-flag"
                    onClick={() => this.onToggleShowFlags()}
                    title="Set Flags"
                />
                <a
                    className="icon-arrow-left"
                    onClick={() => shiftTab(this.props)}
                    title="Make Element a Sibling of Parent"
                />
                <a
                    className="icon-arrow-right"
                    onClick={() => tab(this.props)}
                    title="Make Element a Child of Older Sibling"
                />

                {this.state.showFlags ? (
                    <div className="flags">{
                        flags.map((flag, i) => {
                            return (
                                <div className="flag">
                                    <input 
                                        ref={`flag-${i}`} 
                                        type="checkbox" 
                                        defaultChecked={
                                            this.props.data.content[
                                                this.props.id
                                            ].flags.indexOf(i) > -1
                                        } 
                                    />
                                    <span>{flag}</span>
                                </div>
                            );
                        })
                    }</div>
                ) : (
                    <div className="hidden" />
                )}
            </div>
        );
    }
    
}