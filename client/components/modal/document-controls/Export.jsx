import React from "react";

// Action creators
import { error, success } from "actions/notification";

// Modules
import objectToText from "../../../../lib/notes-convert/to-text";

export default class Export extends React.Component {

	constructor(props) {
		super(props);
        
        this.onExport = this.onExport.bind(this);
	}
	
	onExport() {
		if (Date.now() > this.props.data.user.subscription) {
			this.props.dispatch(error("Free members cannot export documents"));
			return;
		}
	
		let file = "", content = "";
		
		if (this.props.data.document.doc_type == 1)
			content = objectToText(this.props.data.document.content);
		else
			content = this.props.data.document.content;
	
		file = this.props.data.document.name + ".txt";
	
		let dl = document.createElement('a');
		dl.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
		dl.setAttribute('download', file);
		dl.style.display = 'none';
		
		document.body.appendChild(dl);
		dl.click();
		document.body.removeChild(dl);
		
		this.props.dispatch(success(`Exported document '${this.props.data.document.name}'`));
	}
	
	render() {
		return (
			<div className="document-export">
				<p>Convert and download a local version of this document.</p>
				<button className="btn-primary" onClick={this.onExport}>Export Document</button>
			</div>
		);
	}

}