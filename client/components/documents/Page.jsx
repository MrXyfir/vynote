import React from "react";
import marked from "marked";

// Action creators
import {
    saveError, saveContent
} from "actions/documents/index";

// Components
import Editor from "./Editor";

// Modules
import diff from "lib/document/diff";

export default class Page extends React.Component {
	
	constructor(props) {
		super(props);
        
        this.onChange = this.onChange.bind(this);
	}
	
	onChange(e) {
        let data = {
            doc: this.props.data.doc_id, changes: diff(
                this.props.data.content, e.content
            )
        };
		
		this.props.socket.emit("update document content", data, (err) => {
			if (err)
                this.props.dispatch(saveError());
			else
				this.props.dispatch(saveContent(e.content));
		});
	}
	
	render() {
		return (
			<div className={"document document-page-" + (this.props.data.preview ? "preview" : "edit")}>
				{
                    this.props.data.preview
                    ? (
                        <div
                            className="markdown"
                            dangerouslySetInnerHTML={
                                {__html: marked(this.props.data.content, { sanitize: true })}
                            }
                        />
                    )
                    : (
                        <Editor
                            onChange={this.onChange}
                            dispatch={this.props.dispatch}
                            data={this.props.data}
                            user={this.props.user}
                        />
                    )
                }
			</div>
		);
	}
	
}