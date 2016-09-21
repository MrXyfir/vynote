import React from "react";

import Element from "./Element";

export default class Elements extends React.Component {
    
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        if (this.props.onLoad) {
            this.props.onLoad();
        }
    }
    
    render() {
        return (
            <div className="note-elements">{
                this.props.data.content[this.props.scope].children.map(child => {
                    return (
                        <Element
                            id={child}
                            user={this.props.user}
                            data={this.props.data}
                            socket={this.props.socket}
                            dispatch={this.props.dispatch}
                        />
                    );
                })
            }</div>
        );
    }
    
}