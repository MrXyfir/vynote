import React from "react";

import { saveError, saveSuccess, saveContent } from "../../actions/documents/";
import { setSyntax, setTheme } from "../../actions/documents/code";
import { themes, syntaxes } from "../../constants/editor";

import Editor from "./Editor";

export default class Code extends React.Component {
	
	constructor(props) {
		super(props);
        
        this.onSetSyntax = this.onSetSyntax.bind(this);
        this.onSetTheme = this.onSetTheme.bind(this);
        this.onChange = this.onChange.bind(this);
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
				<div className="document-settings">
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
				<Editor onChange={this.onChange} data={this.props.data} shortcuts={this.props.shortcuts} />
			</div>
		);
	}
	
}