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
        
        this._saveElementContent = this._saveElementContent.bind(this);
        this.onInput = this.onInput.bind(this);
        this.onEdit = this.onEdit.bind(this);
        this.onBlur = this.onBlur.bind(this);
        this._focus = this._focus.bind(this);
    }
    
    componentDidMount() {
        this._focus();
    }
    
    componentDidUpdate() {
        this._focus();
    }
    
    onInput(e) {
        // Save element content
        if (e.which == 13) {
            e.preventDefault();
            
            this._saveElementContent(true);
        }
        // Delete element
        else if (e.which == 8 && !this.refs.input.innerHTML.length) {
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
    
    onEdit() {
        this.props.dispatch(editElement(this.props.id));
    }
    
    onBlur() {
        this._saveElementContent();
    }
    
    _focus() {
        if (this.props.id == this.props.data.render.editing)
            this.refs.input.focus();
    }
    
    _saveElementContent(createSibling = false) {
        let data = {
            action: "UPDATE", id: this.props.id, doc: this.props.data.doc_id,
            content: (
                this.props.data.encrypted
                ? encrypt(
                    this.refs.input.innerHTML,
                    this.props.data.encrypt
                )
                : this.refs.input.innerHTML
            )
        };
        
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
                        this.props.data.content[this.props.id].parent, id
                    ));
                    // Set editing for new sibling
                    this.props.dispatch(editElement(id));
                }
            }
        });
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
                        <div 
                            ref="input" 
                            onBlur={this.onBlur}  
                            onKeyDown={this.onInput} 
                            className="editing" 
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