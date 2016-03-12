import React from "react";

import { navigateToElement } from "../../../actions/documents/note";

export default class Parents extends React.Component {
    
    constructor(props) {
        super(props);
    }
    
    onNavigateToParent(id) {
        this.props.dispatch(navigateToElement(id));
    }
    
    render() {
        return (
            <div className="note-parents">{
                this.props.data.render.scopeParents.slice(-5).map(parent => {
                    return (
                        <div className="note-parent">
                            <span className="content" onClick={this.onNavigateToParent.bind(this, parent)}>{
                                this.props.data.content[parent].content.length > 23
                                ? this.props.data.content[parent].content.substr(0, 20) + "..."
                                : this.props.data.content[parent].content 
                            }</span>
                            <span>{">"}</span>
                        </div>
                    );
                })
            }</div>
        );
    }
    
}