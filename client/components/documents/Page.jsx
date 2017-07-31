import React from "react";
import marked from "marked";

// Components
import Editor from "./Editor";

export default class PageDocument extends React.Component {
    
    constructor(props) {
        super(props);
    }
    
    render() {
        return (
            <div
                className={
                    "document document-page-"
                    + (this.props.data.preview ? "preview" : "edit")
            }>
                {this.props.data.preview ? (
                    <div
                        className="markdown"
                        dangerouslySetInnerHTML={{
                            __html: marked(
                                this.props.data.content, { sanitize: true }
                            )
                        }}
                    />
                ) : (
                    <Editor {...this.props} />
                )}
            </div>
        );
    }
    
}