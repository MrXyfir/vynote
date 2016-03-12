import React from "react";

import Elements from "./Elements";

export default class Element extends React.Component {
    
    constructor(props) {
        super(props);
        
        this.onShowExtendedControls = this.onShowExtendedControls.bind(this);
        this.onToggleShowChildren = this.onToggleShowChildren.bind(this);
        this.onScopeToElement = this.onScopeToElement.bind(this);
        this.onEdit = this.onEdit.bind(this);
    }
    
    onShowExtendedControls() {
        
    }
    
    onToggleShowChildren() {
        
    }
    
    onScopeToElement() {
        
    }
    
    onEdit() {
        
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
        
        // User only wants to show elements that contain a listed flag
        if (this.props.data.render.filter.flags.length > 0) {
            let hasFlag = false;
            
            this.props.data.content[this.props.id].flags.forEach(f1 => {
                this.props.data.render.filter.flags.forEach(f2 => {
                    if (f1 == f2) hasFlag = true;
                });
            });
            
            if (!hasFlag) return <div className="note-element-hidden" />;
        }
        
        return (
            <div className="note-element">
                <div className="note-controls">
                    {
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
                    
                    {
                        this.props.id == this.props.data.render.controls
                        ? (
                            <div className="controls-extended">
                                Delete
                                Flags
                                Add Child
                            </div>
                        )
                        : (
                            <span className="hidden" />
                        )
                    }
                </div>
            
                {
                    this.props.id == this.props.data.render.editing
                    ? (
                        <div 
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
                
                {
                    this.props.data.render.showChildren.indexOf(this.props.id) > -1
                    ? (
                        <Elements
                            emit={this.props.emit} 
                            scope={this.props.id} 
                            dispatch={this.props.dispatch}
                        />
                    )
                    : (
                        <div className="note-elements-hidden" />
                    )
                }
            </div>
        );
    }
    
}