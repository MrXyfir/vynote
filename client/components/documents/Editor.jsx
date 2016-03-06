import React from "react";

import { getThemeFile, getSyntaxFile } from "../../constants/editor";

import { encrypt, decrypt } from "../../lib/crypto";

export default class Ace extends React.Component {
	
	constructor(props) {
		super(props);
        
        this._addCommands = this._addCommands.bind(this);
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
        
        this._addCommands();
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
	
        this.props.onChange({
            action: "OVERWRITE", content: (
                (this.props.data.encrypted) 
                ? encrypt(this.editor.getValue(), this.props.data.encrypt)
                : this.editor.getValue()
            )
        });
    
		this.editor.destroy();
		this.editor = null;
	}
    
    _addCommands() {
        // Search for and replace shortcuts with full text in line
        // when user types a '}' character
        this.editor.commands.addCommand({
            name: 'shortcut',
            bindKey: {win: '}',  mac: '}'},
            exec: (editor) => {
                editor.insert('}');
                
                let row  = editor.getCursorPosition().row;
                let line = editor.session.doc.getLine(row);
            
                // Replace shortcuts in line
                Object.keys(this.props.shortcuts || {}).forEach(sc => {
                    line = line.replace("${" + sc + "}", this.props.shortcuts[sc]);
                });
            
                // Write new line
                editor.session.doc.insertLines(row, [line]);
                // Remove old line
                editor.session.doc.removeLines(row + 1, row + 1);
            }
        });
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