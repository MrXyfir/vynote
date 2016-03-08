import React from "react";
import marked from "marked";

import { togglePreview } from "../../actions/documents/page";
import { saveError, saveSuccess, saveContent } from "../../actions/documents/";

import Editor from "./Editor";

export default class Page extends React.Component {
	
	constructor(props) {
		super(props);
        
        this.onTogglePreview = this.onTogglePreview.bind(this);
        this.onChange = this.onChange.bind(this);
	}
	
	onTogglePreview() {
		this.props.dispatch(togglePreview());
	}
	
	onChange(e) {
		e.doc = this.props.data.doc_id;
		
		this.props.socket.emit("update document content", e, (err) => {
			if (err) {
				this.props.dispatch(saveError());
			}
			else {
				this.props.dispatch(saveContent(e.content));
				this.props.dispatch(saveSuccess());
			}
		});
	}
	
	render() {
		let document;
		
		if (!this.props.data.preview)
			document = <div dangerouslySetInnerHTML={{__html: marked(this.props.data.content)}}></div>;
		else
			document = <Editor onChange={this.onChange} data={this.props.data} shortcuts={this.props.shortcuts} />;
	
		return (
			<div className={"document document-page-" + (!this.props.data.preview ? "preview" : "edit")}>
				<a onClick={this.onTogglePreview}>{
					!this.props.data.preview ? "Edit Mode" : "Preview Mode"
				}</a>
				{document}
			</div>
		);
	}
	
}