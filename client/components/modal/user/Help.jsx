import marked from "marked";
import React from "react";

// Actions
import { error, success } from "actions/notification";

// Constants
import { URL } from "constants/config";

// Components
import DynamicIframe from "components/contained/misc/DynamicIframe";

// Modules
import request from "lib/request";

export default class Help extends React.Component {

    componentDidMount() {
        const url = "https://api.github.com/repos/Xyfir/Documentation/contents"
            + "/vynote/help.md";

        request({url, success: (res) => {
            // Add CSS files
            this.refs.frame.refs.frame.contentDocument.head.innerHTML = `
                <link href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,700" rel="stylesheet" type="text/css">
                <link rel="stylesheet" href="static/css/style.css">
            `;

            // Convert markdown to html
            this.refs.frame.refs.frame.contentDocument.body.innerHTML = `
                <div class="markdown">${
                    marked(
                        window.atob(res.content), { santize: true }
                    )
                }</div>
            `;
        }});
    }
    
	render() {
		return <DynamicIframe ref="frame" className="user-help" />
	}

}