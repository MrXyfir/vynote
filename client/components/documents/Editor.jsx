import { Component } from "react";

import { getThemeFile, getSyntaxFile } from "../constants/editor";

export default class Ace extends Component {
	
	constructor(props) {
		super(props);
	}
	
	componentDidMount() {
		this.editor = ace.edit("ace-editor");
		
		this.editor.getSession().setMode(`ace/mode/${getSyntaxFile(this.props.data.syntax)}`);
		this.editor.setTheme(`ace/theme/${getThemeFile(this.props.data.theme)}`);
		this.editor.setShowPrintMargin(false);
		this.editor.setFontSize(16);
		this.editor.on('change', this.onChange);
		
		this.editor.setValue(this.props.data.content);
	}
	
	componentWillUnmount() {
		clearTimeout(this.timeout);
	
		this.editor.destroy();
		this.editor = null;
	}
	
	onChange(e) {
		clearTimeout(this.timeout);
	
		this.timeout = setTimeout(() => {
			this.props.onChange({
				action: "OVERWRITE", content: this.editor.getValue()
			});
		}, 5000);
	}

	render() {
		return (
			<div id="ace-editor"></div>
		);
	}
	
}