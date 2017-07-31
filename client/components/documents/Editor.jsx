import React from "react";

// actions
import { toggleMarkForReload } from "actions/documents/index";
import { saveError, saveContent } from "actions/documents/index";

// Constants
import { getThemeFile, getSyntaxFile } from "constants/editor";

// Modules
import { encrypt, decrypt } from "lib/crypto";
import diff from "lib/document/diff";

export default class Editor extends React.Component {
	
	constructor(props) {
		super(props);
        
        this._addCommands = this._addCommands.bind(this);
        this._saveChanges = this._saveChanges.bind(this);
        this.onChange = this.onChange.bind(this);
	}
	
	componentDidMount() {
        // Determine height of #ace-editor
        if (!this.props.id) {
            this._setEditorHeight();
        }

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
        this.editor.on("change", this.onChange);
        this.editor.setOption("scrollPastEnd", 2);
		
        // Set inintial value without triggering onChange
        this.silent = true;
		this.editor.setValue(
			((this.props.data.encrypted) 
			? decrypt(this.props.data.content, this.props.data.encrypt)
			: this.props.data.content), 1
		);
        this.silent = false;

        // Mobile app only settings
        if (localStorage.getItem("isPhoneGap") == "true") {
            this.editor.renderer.setShowGutter(false);
        }
        
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
            ||
            !!nProps.data.reload
        );
    }

    componentWillUpdate(nProps, nState) {
        if (this.props.data.doc_id != nProps.data.doc_id && this.changed) {
            clearTimeout(this.timeout);
            this._saveChanges(true);
        }
    }
    
    componentDidUpdate() {
        // Update syntax/theme
        this.editor.getSession().setMode(getSyntaxFile(this.props.data.syntax));
		this.editor.setTheme(getThemeFile(this.props.data.theme));

        const position = this.editor.selection.getCursor();
        
        // Update content
        this.silent = true;
		this.editor.setValue(
			(this.props.data.encrypted
			? decrypt(this.props.data.content, this.props.data.encrypt)
			: this.props.data.content), 1
		);
        this.silent = false;

        this.editor.gotoLine(position.row + 1, position.column + 1);
        
        // Set state.document.reload = false
        if (this.props.data.reload)
            this.props.dispatch(toggleMarkForReload());
    }
	
	componentWillUnmount() {
		clearTimeout(this.timeout);
	
        if (this.changed) this._saveChanges();
    
		this.editor.destroy();
		this.editor = null;
	}

    onChange(e) {
        if (this.silent) return;
        
		clearTimeout(this.timeout);
	
		this.timeout = setTimeout(() => {
			this._saveChanges();
            this.changed = false;
		}, 5000);
        
        this.changed = true;
	}

    _saveChanges(skipSave) {
        const data = {
            doc: this.props.data.doc_id,
            changes: diff(
                this.props.data.content, (this.props.data.encrypted
                    ? encrypt(this.editor.getValue(), this.props.data.encrypt)
                    : this.editor.getValue())
            )
        };
		
		this.props.socket.emit("update document content", data, (err) => {
			if (err)
                this.props.dispatch(saveError());
			else if (!skipSave)
				this.props.dispatch(saveContent(content));
		});
    }

    _setEditorHeight() {
        const css = `
            #ace-editor {height: ${Math.floor(
                document.querySelector(".status-bar").getBoundingClientRect().top
                - this.refs.editor.getBoundingClientRect().top
            )}px;}
        `;
        let s = document.getElementById("vynote-editor-styles");

        // Create #vynote-editor-styles
        if (s == null) {
            s = document.createElement("style");
            s.setAttribute("id", "vynote-editor-styles");
            document.head.appendChild(s);
        }

        s.innerHTML = css;
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
                    line = line.replace(
                        "${" + sc + "}", this.props.user.shortcuts[sc]
                    );
                });
            
                // Write new line
                editor.session.doc.insertLines(row, [line]);
                // Remove old line
                editor.session.doc.removeLines(row + 1, row + 1);
            }
        });
        
        // Disable default save
        this.editor.commands.addCommand({
            name: 'save',
            bindKey: {win: "Ctrl-S", "mac": "Cmd-S"},
            exec: (editor) => 0
        })
    }

	render() {
		return (
			<div id={this.props.id || "ace-editor"} ref="editor" />
		);
	}
	
}