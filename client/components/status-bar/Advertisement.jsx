import React from "react";

export default class Advertisement extends React.Component {
    
    constructor(props) {
        super(props);
        
        this.onClick = this.onClick.bind(this);
    }
    
    onClick() {
        window.open(this.props.data.ad.link);
    }
    
    render() {
        <div className="notification">
            <span>Advertisement: </span>
            <a onClick={this.onClick}>{this.props.data.ad.title}</a>
            <span> - {this.props.data.ad.description}</span>
        </div>
    }
    
}