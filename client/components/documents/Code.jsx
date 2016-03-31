import React from "react";

// Action creators
import { saveError, saveContent } from "../../actions/documents/";
import { setSyntax, setTheme } from "../../actions/documents/code";
import { themes, syntaxes } from "../../constants/editor";

// Components
import Editor from "./Editor";

// Modules
import diff from "../../lib/document/diff";

export default class Code extends React.Component {
	
	constructor(props) {
		super(props);
        
        this.onSetSyntax = this.onSetSyntax.bind(this);
        this.onSetTheme = this.onSetTheme.bind(this);
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
	
	onSetSyntax() {
		const syntax = +this.refs.syntax.value; 
		
		this.props.socket.emit("set document syntax", this.props.data.doc_id, syntax, (err) => {
            console.log("error status ", err);
			if (!err) {
				this.props.dispatch(setSyntax(syntax));
			}
		});
	}
	
	onSetTheme() {
		this.props.dispatch(setTheme(+this.refs.theme.value));
	}
	
	render() {
		return (
			<div className="document document-code">
                {
                    this.props.data.showEditorSettings
                    ? (
                        <div className="editor-settings">
                            <label>Syntax</label>
                            <select ref="syntax" onChange={this.onSetSyntax} defaultValue={this.props.data.syntax}>{
                                syntaxes.map((syntax, i) => {
                                    return (<option value={i}>{syntax[0]}</option>);
                                })
                            }</select>
                            
                            <label>Theme</label>
                            <select ref="theme" onChange={this.onSetTheme} defaultValue={this.props.data.theme}>{
                                themes.map((theme, i) => {
                                    return (<option value={i}>{theme[0]}</option>);
                                })
                            }</select>
                        </div>
                    ) : <div />
                }
				
				<Editor
                    onChange={this.onChange}
                    dispatch={this.props.dispatch}
                    data={this.props.data}
                    user={this.props.user}
                />
			</div>
		);
	}
	
}