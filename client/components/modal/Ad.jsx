import React from "react";

// Contants
import { URL } from "../../constants/config";

export default class Ad extends React.Component {
    
    constructor(props) {
        super(props);
        
        this.onClick = this.onClick.bind(this);
    }
    
    componentDidMount() {
        document.querySelector(".modal > .icon-close").style.display = "none";
        
        setTimeout(() => {
            document.querySelector(".modal > .icon-close").style.display = "inline";
        }, 7 * 1000);
    }
    
    onClick() {
        window.open(this.props.data.link);
    }
    
    render() {
        return (
            <div>
                <h3><a onClick={this.onClick}>{this.props.data.title}</a></h3>
                <p>{this.props.data.description}</p>
                
                <div className="footer">
                    <p>Don't want ads interrupting you? Check out <a target="_blank" href={URL + "#Premium"}>Vynote Premium</a>.</p>
                </div>
            </div>
        );
    }
    
}