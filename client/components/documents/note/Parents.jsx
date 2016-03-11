import React from "react";

export default class Parents extends React.Component {
    
    constructor(props) {
        super(props);
    }
    
    onNavigateToParent(id) {
        this.props.dispatch();
    }
    
    render() {
        return (
            <div className="note-parents">{
                this.props.data.scopeParents.slice(-5).map(parent => {
                    return (
                        <div className="note-parent">
                            <span className="content" onClick={this.onNavigateToParent.bind(this, parent)}>{
                                this.props.data.content.notes[parent].content.length > 23
                                ? this.props.data.content.notes[parent].content.substr(0, 20) + "..."
                                : this.props.data.content.notes[parent].content 
                            }</span>
                            <span>{">"}</span>
                        </div>
                    );
                })
            }</div>
        );
    }
    
}