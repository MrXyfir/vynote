import React from "react";

// Components
import Encrypted from "components/documents/Encrypted";
import Page from "components/documents/Page";
import Note from "components/documents/Note";
import Code from "components/documents/Code";
import Head from "components/documents/Head";

export default class Document extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        let view;

        if (this.props.data.document.doc_type == 0) {
            return <div />;
        }
        // Document is encrypted and user has not provided key
        else if (
            this.props.data.document.encrypted
            && this.props.data.document.encrypt === ""
        ) {
            view = (
                <Encrypted
                    data={this.props.data}
                    socket={this.props.socket} 
                    dispatch={this.props.dispatch} 
                />
            );
        }
        // Output appropriate component to handle document
        else {
            switch (this.props.data.document.doc_type) {
                case 1:
                    view = (
                        <Note
                            user={this.props.data.user}
                            data={this.props.data.document}
                            socket={this.props.socket} 
                            dispatch={this.props.dispatch} 
                        />
                    ); break;
                case 2:
                    view = (
                        <Page
                            user={this.props.data.user}
                            data={this.props.data.document}
                            socket={this.props.socket} 
                            dispatch={this.props.dispatch} 
                        />
                    ); break;
                case 3:
                    view = (
                        <Code
                            user={this.props.data.user}
                            data={this.props.data.document}
                            socket={this.props.socket}
                            dispatch={this.props.dispatch}
                        />
                    ); break;
            }
        }

        return (
            <div className={
                "document-container" + (this.props.data.view != "all" ? (
                    this.props.data.view == "document" ? " full" : " hidden"
                ) : "")
            }>
                <Head
                    data={this.props.data}
                    socket={this.props.socket}
                    dispatch={this.props.dispatch}
                />
                {view}
            </div>
        );
    }

}