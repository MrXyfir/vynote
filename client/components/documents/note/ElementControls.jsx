import React from "react";

export default class ElementControls extends React.Component {
    
    constructor(props) {
        super(props);
        
        this.onShowExtendedControls = this.onShowExtendedControls.bind(this);
        this.onToggleShowChildren = this.onToggleShowChildren.bind(this);
        this.onScopeToElement = this.onScopeToElement.bind(this);
    }
    
    onShowExtendedControls() {
        
    }
    
    onToggleShowChildren() {
        
    }
    
    onScopeToElement() {
        
    }
    
    render() {
        return (
            <div className="note-controls">
            { // Output 'Show Children' toggle if element is being hovered
                this.props.id == this.props.data.render.hovering
                ? (
                    this.props.data.render.showChildren.indexOf(this.props.id) > -1
                    ? (<span onClick={this.onToggleShowChildren}>-</span>)
                    : (<span onClick={this.onToggleShowChildren}>+</span>)
                )
                : (
                    <span className="hidden" />
                )
            }
            <span 
                onClick={this.onScopeToElement}
                className="icon-circle" 
                onContextMenu={this.onShowExtendedControls} 
            />
            
            { // Optionally render extended controls
                this.props.id == this.props.data.render.controls
                ? (
                    <div className="controls-extended">
                        Delete
                        Flags
                        Add Child
                        Duplicate
                        Export
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