import React from "react";

import { getThemeFile, getSyntaxFile } from "../../constants/editor";

import { encrypt, decrypt } from "../../lib/crypto";

export default class Ace extends React.Component {
	
	constructor(props) {
		super(props);
        
        this.onChange = this.onChange.bind(this);
	}
	
	componentDidMount() {
		this.editor = ace.edit(this.props.id || "ace-editor");
		
		this.editor.getSession().setMode(getSyntaxFile(this.props.data.syntax));
		this.editor.setTheme(getThemeFile(this.props.data.theme));
		this.editor.setShowPrintMargin(false);
		this.editor.setFontSize(16);
		this.editor.on('change', this.onChange);
		
		this.editor.setValue(
			(this.props.data.encrypted) 
			? decrypt(this.props.data.content, this.props.data.encrypt)
			: this.props.data.content
		);
	}
    
    shouldComponentUpdate(nProps, nState) {
        return nProps.data.syntax != this.props.data.syntax || nProps.data.theme != this.props.data.theme;
    }
    
    componentDidUpdate() {
        this.editor.getSession().setMode(getSyntaxFile(this.props.data.syntax));
		this.editor.setTheme(getThemeFile(this.props.data.theme));
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
				action: "OVERWRITE", content: (
					(this.props.data.encrypted) 
					? encrypt(this.editor.getValue(), this.props.data.encrypt)
					: this.editor.getValue()
				)
			});
		}, 5000);
	}

	render() {
		return (
			<div id={this.props.id || "ace-editor"}></div>
		);
	}
	
}