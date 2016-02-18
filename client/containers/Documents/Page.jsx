import { Component } from "react";
import marked from "marked";

import { togglePreview } from "../../actions/documents/page";
import { saveError, saveSuccess, saveContent } from "../../actions/documents/";

import Editor from "../../components/documents/Editor";

export default class Page extends Component {
	
	constructor(props) {
		super(props);
	}
	
	onTogglePreview() {
		this.props.dispatch(togglePreview());
	}
	
	onChange(e) {
		this.props.emit("update document content", e, (err) => {
			if (err) {
				this.props.dispatch(saveError());
			}
			else {
				this.props.dispatch(saveContent(e));
				this.props.dispatch(saveSuccess());
			}
		});
	}
	
	render() {
		let document;
		
		if (this.props.data.preview) {
			document = <div dangerouslySetInnerHTML={{__html: marked(this.props.data.content)}}></div>
		}
		else {
			document = <Editor onChange={this.onChange} data={this.props.data} />;
		}
	
		return (
			<div className={"document document-page-" + (this.props.data.preview ? "preview" : "edit")}>
				{document}
			</div>
		);
	}
	
}