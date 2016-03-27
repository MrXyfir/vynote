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
		
        // User set values
		this.editor.getSession().setMode(getSyntaxFile(this.props.data.syntax));
		this.editor.setTheme(getThemeFile(this.props.data.theme));
		this.editor.setFontSize(
            (this.props.fontSize || this.props.user.config.editorFontSize) + "em"
        );
        
        // Always set values
        this.editor.session.setOption("wrap", "free");
        this.editor.setShowPrintMargin(false);
        this.editor.on('change', this.onChange);
		
        // Set inintial value without triggering onChange
        this.silent = true;
		this.editor.setValue(
			(this.props.data.encrypted) 
			? decrypt(this.props.data.content, this.props.data.encrypt)
			: this.props.data.content
		);
        this.silent = false;
        
        // Bind keyboard commands to editor
        this._addCommands();
	}
    
    shouldComponentUpdate(nProps, nState) {
        return (
            nProps.data.syntax != this.props.data.syntax
            ||
            nProps.data.theme != this.props.data.theme
            ||
            nProps.data.doc_id != this.props.data.doc_id
        );
    }
    
    componentDidUpdate() {
        // Update syntax/theme
        this.editor.getSession().setMode(getSyntaxFile(this.props.data.syntax));
		this.editor.setTheme(getThemeFile(this.props.data.theme));
        
        // Update content
        this.silent = true;
		this.editor.setValue(
			(this.props.data.encrypted) 
			? decrypt(this.props.data.content, this.props.data.encrypt)
			: this.props.data.content
		);
        this.silent = false;
    }
	
	componentWillUnmount() {
		clearTimeout(this.timeout);
	
        if (this.changed) {
            this.props.onChange({
                action: "OVERWRITE", content: (
                    (this.props.data.encrypted) 
                    ? encrypt(this.editor.getValue(), this.props.data.encrypt)
                    : this.editor.getValue()
                )
            });
        }
    
		this.editor.destroy();
		this.editor = null;
        
        document.body.onresize = function(){};
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
                Object.keys(this.props.user.shortcuts || {}).forEach(sc => {
                    line = line.replace("${" + sc + "}", this.props.user.shortcuts[sc]);
                });
            
                // Write new line
                editor.session.doc.insertLines(row, [line]);
                // Remove old line
                editor.session.doc.removeLines(row + 1, row + 1);
            }
        });
    }
	
	onChange(e) {
        if (this.silent) return;
        
		clearTimeout(this.timeout);
	
		this.timeout = setTimeout(() => {
			this.props.onChange({
				action: "OVERWRITE", content: (
					(this.props.data.encrypted) 
					? encrypt(this.editor.getValue(), this.props.data.encrypt)
					: this.editor.getValue()
				)
			});
            
            this.changed = false;
		}, 5000);
        
        this.changed = true;
	}

	render() {
		return (
			<div id={this.props.id || "ace-editor"} />
		);
	}
	
}