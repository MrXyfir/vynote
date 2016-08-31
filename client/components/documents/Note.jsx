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
                    user={this.props.user}
                    data={this.props.data} 
                    socket={this.props.socket} 
                    scope={this.props.data.render.scope} 
                    dispatch={this.props.dispatch}
                />
            </div>
        );
    }
    
}