import marked from "marked";
import React from "react";

// Components
import ElementControls from "./ElementControls";
import Elements from "./Elements";

// Action creators
import {
    addElement, updateElementContent, editElement,
    deleteElement, elementCreated
} from "../../../actions/documents/note";
import { error } from "../../../actions/notification";

// Modules
import {
    tab, shiftTab, up, down, altLeft, altRight, altEnter,
    altDel, ctrlF, at, hash, cbracket, altUp, altDown
} from "../../../lib/note/kbe-handlers";
import generateID from "../../../lib/note/generate-id";
import { encrypt } from "../../../lib/crypto";

export default class Element extends React.Component {
    
    constructor(props) {
        super(props);
        
        this._saveElementContent = this._saveElementContent.bind(this);
        this.onInput = this.onInput.bind(this);
        this.onEdit = this.onEdit.bind(this);
        this.onBlur = this.onBlur.bind(this);
        
        this.keys = {
            shift: 16, alt: 18, tab: 9, left: 37, up: 38,
            right: 39, down: 40, ctrl: 17, enter: 13,
            f: 70, del: 46, at: 50, hash: 51,
            cbracket: 221, backspace: 8
        };

        this.previous = {
            wasModifier: false, key: 0
        };
        
        if (!window.onRefClick) {
            window.onRefClick = (val) => {
                let input = document.querySelector(".note-filter-controls > input");
                input.value = val;
                input.dispatchEvent(new Event("input", { bubbles: true }));
            };
        }
    }
    
    onInput(e) {
        let wasModifier = false;
  
        // Prevent default for certain keys
        if ([this.keys.enter, this.keys.tab].indexOf(e.which) > -1)
            e.preventDefault();

        // Current key is a modifier key
        if ([16, 18, 17].indexOf(e.which) > -1) {
            wasModifier = true;
        }
        // Previous key was a modifier
        else if (this.previous.wasModifier) {
            if (this.previous.key == this.keys.alt) {
                switch (e.which) {
                    case this.keys.left: altLeft(this.props); break;
                    case this.keys.up: altUp(this.props); break;
                    case this.keys.right: altRight(this.props); break;
                    case this.keys.down: altDown(this.props); break;
                    case this.keys.enter: altEnter(this.props); break;
                    case this.keys.del: altDel(this.props); break;
                }
            }
            else if (this.previous.key == this.keys.ctrl) {
                if (e.which == this.keys.f) {
                    ctrlF(this.props);
                }
            }
            else if (this.previous.key == this.keys.shift) {
                switch (e.which) {
                    case this.keys.at: at(this.props); break;
                    case this.keys.hash: hash(this.props); break;
                    case this.keys.tab: shiftTab(this.props); break;
                    case this.keys.cbracket: cbracket(this.props, e); break;
                }
            }
        }
        // Normal key and last was not a modifier
        else {
            switch (e.which) {
                case this.keys.tab: tab(this.props); break;
                case this.keys.up: up(this.props); break;
                case this.keys.down: down(this.props); break;
                case this.keys.enter: this._saveElementContent(true); break;
                case this.keys.backspace: this._deleteElement(e); break;
            }
        }

        // Set current key as previous
        this.previous = {
            key: e.which, wasModifier
        }
    }
    
    onEdit() {
        this.props.dispatch(editElement(this.props.id));
    }
    
    onBlur() {
        this._saveElementContent();
    }
    
    _saveElementContent(createSibling = false) {
        let data = {
            action: "UPDATE", id: this.props.id, doc: this.props.data.doc_id,
            content: (
                this.props.data.encrypted
                ? encrypt(
                    this.refs.input.value,
                    this.props.data.encrypt
                )
                : this.refs.input.value
            )
        };
        
        // Determine at what index to add sibling to parent's children
        if (createSibling) {
            let parent = this.props.data.content[data.id].parent
            let index  = this.props.data.content[parent].children.indexOf(data.id);
            
            if (index + 1 == this.props.data.content[parent].children.length)
                data.index = -1; // push to end of array
            else
                data.index = index + 1; // add after current element
        }
        
        // Element has only been created locally
        if (this.props.data.content[this.props.id].create) {
            data.parent = this.props.data.content[this.props.id].parent;
            data.action = "CREATE";
        }
        
        this.props.socket.emit("change note element", data, (err, res) => {
            if (err) {
                this.props.dispatch(error(res));
            }
            else {
                // Update element's content
                this.props.dispatch(updateElementContent(
                    this.props.id, data.content
                ));
                
                // Element has been fully created
                if (this.props.data.content[this.props.id].create)
                    this.props.dispatch(elementCreated(this.props.id));
                
                if (createSibling) {
                    // Generate ID for new sibling element
                    let id = generateID(this.props.data.content);
                    // Create a new sibling element
                    this.props.dispatch(addElement(
                        this.props.data.content[this.props.id].parent, id, data.index
                    ));
                    // Set editing for new sibling
                    this.props.dispatch(editElement(id));
                }
            }
        });
    }
    
    _deleteElement(e) {
        if (!this.refs.input.value.length) {
            // Prevent backspace from navigating to previous page
            e.preventDefault();
            
            const del = (id) => {
                let parent  = this.props.data.content[id].parent;
                let index   = this.props.data.content[parent].children.indexOf(id);
                let sibling = this.props.data.content[parent].children[index - 1];
                
                this.props.dispatch(deleteElement(id));
                
                // Set 'editing' to element's older sibling (if available)
                if (sibling !== undefined) this.props.dispatch(editElement(sibling));
            };
            
            // Element was only created locally
            if (this.props.data.content[this.props.id].create) {
                del(this.props.id);
            }
            // Delete event must be emitted
            else {
                let data = {
                    doc: this.props.data.doc_id, action: "DELETE", id: this.props.id
                };
                
                this.props.socket.emit("change note element", data, (err, res) => {
                    if (err)
                        this.props.dispatch(error(res));
                    else
                        del(data.id);
                });
            }
        }
    }
    
    _parseContent() {
        return marked(
            this.props.data.content[this.props.id].content,
            { sanitize: true }
        )
        .replace(
            new RegExp("<p>(@|#)([a-zA-Z0-9]{1,})", 'g'),
            `<a onclick="onRefClick('$1$2')">$1$2</a>`
        ).replace(
            new RegExp(" (@|#)([a-zA-Z0-9]{1,})", 'g'),
            `<a onclick="onRefClick('$1$2')">$&</a>`
        );
    }
    
    render() {
        // Only show elements that contain search query
        if (this.props.data.render.filter.search != "") {
            if (
                this.props.data.content[this.props.id].content.indexOf(
                    this.props.data.render.filter.search
                ) == -1
            ) return <div className="note-element-hidden" />;
        }
        
        // Hide element if it contains an excluded flag
        if (this.props.data.render.filter.flags.length > 0) {
            let hasFlag = false;
            
            this.props.data.content[this.props.id].flags.forEach(f1 => {
                this.props.data.render.filter.flags.forEach(f2 => {
                    if (f1 == f2) hasFlag = true;
                });
            });
            
            if (hasFlag) return <div className="note-element-hidden" />;
        }
        
        return (
            <div className="note-element">
                <ElementControls
                    id={this.props.id} 
                    data={this.props.data} 
                    socket={this.props.socket} 
                    dispatch={this.props.dispatch}
                />
            
                { // Output content in an editable or markdown-rendered element
                    this.props.id == this.props.data.render.editing
                    ? (
                        <input 
                            ref="input" 
                            type="text"  
                            onBlur={this.onBlur} 
                            onKeyDown={this.onInput} 
                            className="editing" 
                            autoFocus={true} 
                            defaultValue={this.props.data.content[this.props.id].content}
                        />
                    )
                    : (
                        <div 
                            className="view" 
                            onClick={this.onEdit} 
                            dangerouslySetInnerHTML={
                                {__html: this._parseContent()}
                            }
                        />
                    )
                }
                
                { // Optionally output element's children
                    this.props.data.render.showChildren.indexOf(this.props.id) > -1
                    ? (
                        <Elements
                            user={this.props.user}
                            data={this.props.data}
                            socket={this.props.socket} 
                            scope={this.props.id} 
                            dispatch={this.props.dispatch}
                        />
                    )
                    : (
                        <div className="hidden" />
                    )
                }
            </div>
        );
    }
    
}