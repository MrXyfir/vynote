import marked from "marked";
import React from "react";

// Action creators
import { error, success } from "../../../actions/notification";

// Constants
import { URL } from "../../../constants/config";

export default class Help extends React.Component {
	
    componentDidMount() {
        let http = new XMLHttpRequest();
        http.onreadystatechange = () => { 
            document.querySelector(".user-help").innerHTML = marked(http.responseText);
        }
        http.open("GET", URL + "documentation/help.md", true); http.send();
    }
    
	render() {
		return <div className="user-help markdown" />;
	}

}