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
import generateID from "../../../lib/note/generate-id";
import { encrypt } from "../../../lib/crypto";

export default class Element extends React.Component {
    
    constructor(props) {
        super(props);
        
        this._focusEditElement = this._focusEditElement.bind(this);
        this.onInput = this.onInput.bind(this);
        this.onEdit = this.onEdit.bind(this);
    }
    
    componentDidMount() {
        this._focusEditElement();
    }
    
    componentDidUpdate() {
        this._focusEditElement();
    }
    
    onInput(e) {
        // Save element content
        if (e.which == 13) {
            e.preventDefault();
            
            let data = {
                action: "UPDATE", id: this.props.id, doc: this.props.data.doc_id,
                content: (
                    this.props.data.encrypted
                    ? encrypt(
                        document.querySelector(".note-element > .editing").innerHTML,
                        this.props.data.encrypt
                    )
                    : document.querySelector(".note-element > .editing").innerHTML
                )
            };
            
            // Element has only been created locally
            if (this.props.data.content[this.props.id].create) {
                data.parent = this.props.data.content[this.props.id].parent;
                data.action = "CREATE";
            }
            
            this.props.emit("change note element", data, (err, res) => {
                if (err) {
                    this.props.dispatch(error(res));
                }
                else {
                    // Generate ID for new sibling element
                    let id = generateID(this.props.data.content);
                    
                    // Update element's content
                    this.props.dispatch(updateElementContent(
                        this.props.id, data.content
                    ));
                    // Create a new sibling element
                    this.props.dispatch(addElement(
                        this.props.data.content[this.props.id].parent, id
                    ));
                    // Set editing for new sibling
                    this.props.dispatch(editElement(id));
                    
                    // Element has been fully created
                    if (this.props.data.content[this.props.id].create)
                        this.props.dispatch(elementCreated(this.props.id));
                }
            });
        }
        // Delete element
        else if (e.which == 8) {
            if (!document.querySelector(".note-element > .editing").innerHTML.length) {
                // Element was only created locally
                if (this.props.data.content[this.props.id].create) {
                    this.props.dispatch(deleteElement(data.id));
                    return;
                }
                
                let data = {
                    action: "DELETE", id: this.props.id
                };
                
                this.props.emit("change note element", data, (err, res) => {
                    if (err) {
                        this.props.dispatch(error(res));
                    }
                    else {
                        this.props.dispatch(deleteElement(data.id));
                    }
                });
            }
        }
    }
    
    onEdit() {
        this.props.dispatch(editElement(this.props.id));
    }
    
    _focusEditElement() {
        if (this.props.id == this.props.data.render.editing) {
            document.querySelector(".note-element > .editing").focus();
        }
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
                    emit={this.props.emit} 
                    dispatch={this.props.dispatch}
                />
            
                { // Output content in an editable or markdown-rendered element
                    this.props.id == this.props.data.render.editing
                    ? (
                        <div 
                            className="editing" 
                            onKeyUp={this.onInput} 
                            contentEditable={true} 
                            dangerouslySetInnerHTML={{
                                __html: this.props.data.content[this.props.id].content
                            }}
                        />
                    )
                    : (
                        <div 
                            className="view" 
                            onClick={this.onEdit} 
                            dangerouslySetInnerHTML={
                                {__html: marked(
                                    this.props.data.content[this.props.id].content,
                                    { sanitize: true }
                                )}
                            }
                        />
                    )
                }
                
                { // Optionally output element's children
                    this.props.data.render.showChildren.indexOf(this.props.id) > -1
                    ? (
                        <Elements
                            data={this.props.data}
                            emit={this.props.emit} 
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