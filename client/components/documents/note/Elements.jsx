import React from "react";

import Element from "./Element";

export default class Elements extends React.Component {
    
    constructor(props) {
        super(props);
    }
    
    render() {
        return (
            <div className="note-elements">{
                this.props.data.content[this.props.scope].children.map(child => {
                    return (
                        <Element 
                            id={child} 
                            data={this.props.data} 
                            emit={this.props.emit} 
                            dispatch={this.props.dispatch}
                        />
                    );
                })
            }</div>
        );
    }
    
}