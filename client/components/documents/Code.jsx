import { Component } from "react";

import { saveError, saveSuccess, saveContent } from "../../actions/documents/";
import { setSyntax, setTheme } from "../../actions/documents/code";
import { themes, syntaxes } from "../../constants/editor";

import Editor from "./Editor";

export default class Code extends Component {
	
	constructor(props) {
		super(props);
	}
	
	onChange(e) {
		e.id = this.props.data.id;
		
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
	
	onSetSyntax() {
		this.props.dispatch(setSyntax(this.refs.syntax.value));
	}
	
	onSetTheme() {
		this.props.dispatch(setTheme(this.refs.theme.value));
	}
	
	render() {
		return (
			<div className="document document-code">
				<div className="document-settings">
					<label>Syntax</label>
					<select ref="syntax" onChange={this.onSetSyntax}>{
						syntaxes.map((syntax, i) => {
							return (<option value={i}>{syntax[0]}</option>);
						})
					}</select>
					
					<label>Theme</label>
					<select ref="theme" onChange={this.onSetTheme}>{
						themes.map((theme, i) => {
							return (<option value={i}>{theme[0]}</option>);
						})
					}</select>
				</div>
				<Editor onChange={this.onChange} data={this.props.data} />
			</div>
		);
	}
	
}