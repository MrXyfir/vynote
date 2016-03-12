import React from "react";

// React components
import FilterControls from "./note/FilterControls";
import Elements from "./note/Elements";
import Parents from "./note/Parents";

export default class Note extends React.Component {
    
    constructor(props) {
        super(props);
    }
    
    render() {
        return (
            <div className="document-note">
                <FilterControls dispatch={this.props.dispatch} />
                <Parents dispatch={this.props.dispatch} data={this.props.data} />
                
                <div className="note-scoped-element">
                    <span className="icon-add" onClick={this.onAddChildElement} />
                    <span className="content">{
                        this.props.data.content[this.props.data.render.scope].content > 23
                        ? this.props.data.content[this.props.data.render.scope].content.substr(0, 20) + "..."
                        : this.props.data.content[this.props.data.render.scope].content
                    }</span>
                </div>
                
                <Elements
                    emit={this.props.emit} 
                    scope={this.props.data.render.scope} 
                    dispatch={this.props.dispatch}
                />
            </div>
        );
    }
    
}