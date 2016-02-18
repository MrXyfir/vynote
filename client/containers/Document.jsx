import { Component } from "react";

import Page from "../components/documents/Page";
import Note from "../components/documents/Note";
import Code from "../components/documents/Code";

export default class Document extends Component {

    render() {
        switch (this.props.data.type) {
            case 1:
                return <Note data={this.props.data} emit={this.props.emit} dispatch={this.props.dispatch}></Note>;
            case 2:
                return <Page data={this.props.data} emit={this.props.emit} dispatch={this.props.dispatch}></Page>;
            case 3:
                return <Code data={this.props.data} emit={this.props.emit} dispatch={this.props.dispatch}></Code>;
        }
    }

}