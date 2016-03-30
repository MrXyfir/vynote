import React from "react";
import marked from "marked";

// Action creators
import {
    saveError, saveContent
} from "../../actions/documents/";

// Components
import Editor from "./Editor";

export default class Page extends React.Component {
	
	constructor(props) {
		super(props);
        
        this.onChange = this.onChange.bind(this);
	}
	
	onChange(e) {
		e.doc = this.props.data.doc_id;
		
		this.props.socket.emit("update document content", e, (err) => {
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