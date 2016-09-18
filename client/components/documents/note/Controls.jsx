import React from "react";

// Action creators
import {
    toggleShowChildren, navigateToElement
} from "actions/documents/note";

export default class ElementControls extends React.Component {
    
    constructor(props) {
        super(props);
    }

    onToggleShowChildren() {
        this.props.dispatch(toggleShowChildren(this.props.id));
    }
    
    onScopeToElement() {
        this.props.dispatch(navigateToElement(this.props.id));
    }
    
    render() {
        return (
            <div className="note-controls">
                { /* Output 'Show Children' toggle if element has children */ }
                {this.props.data.content[this.props.id].children.length > 0 ? (
                    this.props.data.render.showChildren.indexOf(this.props.id) > -1 ? (
                        <span 
                            title="Hide Children"
                            onClick={() => this.onToggleShowChildren()} 
                            className="toggle-show-children hide"
                        >-</span>
                    ) : (
                        <span 
                            title="Show Children"
                            onClick={() => this.onToggleShowChildren()}
                            className="toggle-show-children show" 
                        >+</span>
                    )
                ) : (
                    <span className="toggle-show-children" />
                )}

                <span
                    title="Scope to Element"  
                    onClick={() => this.onScopeToElement()}
                    className="icon-circle-outline"
                />
            </div>
        );
    }
    
}