import React from "react";

// React components
import FilterControls from "./note/FilterControls";
import Elements from "./note/Elements";
import Parents from "./note/Parents";

// Action creators
import { addElement, editElement } from "actions/documents/note";

// Modules
import generateID from "lib/note/generate-id";

export default class Note extends React.Component {
    
    constructor(props) {
        super(props);
        
        this.onAddElement = this.onAddElement.bind(this);
    }
    
    onAddElement() {
        let id = generateID(this.props.data.content); 
        
        this.props.dispatch(addElement(
            this.props.data.render.scope, id
        ));
        this.props.dispatch(editElement(id))
    }

    _setHeight() {
        const css = `
            .document-note > .note-elements {height: ${Math.floor(
                document.querySelector(".status-bar")
                    .getBoundingClientRect().top
                - document.querySelector(".document-note > .note-elements")
                    .getBoundingClientRect().top
            )}px;}
        `;
        let s = document.getElementById("vynote-note-styles");

        // Create #vynote-note-styles
        if (s == null) {
            s = document.createElement("style");
            s.setAttribute("id", "vynote-note-styles");
            document.head.appendChild(s);
        }

        s.innerHTML = css;
    }
    
    render() {
        if (this.props.data.render === undefined) {
            return <div />;
        }
        
        return (
            <div className="document document-note">
                <FilterControls data={this.props.data} dispatch={this.props.dispatch} />
                <Parents dispatch={this.props.dispatch} data={this.props.data} />
                
                <div className="note-scoped-element">
                    <span 
                        title="Add Child"
                        onClick={this.onAddElement}
                        className="icon-add"  
                    />
                    <span className="content">{
                        this.props.data.content[this.props.data.render.scope].content
                    }</span>
                </div>
                
                <Elements
                    user={this.props.user}
                    data={this.props.data} 
                    socket={this.props.socket} 
                    scope={this.props.data.render.scope}
                    onLoad={this._setHeight} 
                    dispatch={this.props.dispatch}
                />
            </div>
        );
    }
    
}