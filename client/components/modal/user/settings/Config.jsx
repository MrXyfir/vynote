import React from "react";

// Action creators
import { setConfig } from "actions/user/index";
import { error, success } from "actions/notification";

// Constants
import { themes, syntaxes } from "constants/editor";
import colors from "constants/colors";

export default class Config extends React.Component {

	constructor(props) {
		super(props);
	}
    
    onUpdateConfiguration(e) {
        e.preventDefault();

        const config = {
            defaultExplorerObjectColor: +this.refs["default-explorer-color"].value,
            defaultDocumentType: this.refs["default-document-type"].value,
            defaultEditorTheme: +this.refs["default-editor-theme"].value,
			defaultCodeSyntax: +this.refs["default-code-syntax"].value,
            defaultPageView: this.refs["default-page-view"].value,
			editorFontSize: +this.refs["editor-font-size"].value,
			darkTheme: this.refs["dark-theme"].checked
        };
        
        this.props.socket.emit("update config", config, (err, res) => {
            if (err) {
                this.props.dispatch(error(res));
            }
            else {
                this.props.dispatch(success("Configuration updated"));
                this.props.dispatch(setConfig(config));
                
                if (config.darkTheme)
                    document.body.className = "theme-dark";
                else
                    document.body.className = "";
            }
        });
    }
	
	render() {
        const c = this.props.data.user.config;
        
		return (
            <form
                className="config"
                onSubmit={(e) => this.onUpdateConfiguration(e)}
            >
                <label>Default Explorer Object Color</label>
                <span className="input-description">
                    This color will automatically be set when creating a document or folder.
                </span>
                <select
                    ref="default-explorer-color"
                    defaultValue={c.defaultExplorerObjectColor}
                >{
                    colors.map((color, i) =>
                        <option value={i}>{color}</option>
                    )
                }</select>
                
                <label>Default Document Type</label>
                <span className="input-description">
                    This type will automatically be set when creating a document or folder.
                </span>
                <select
                    ref="default-document-type"
                    defaultValue={c.defaultDocumentType}
                >
                    <option value="0">Document Type</option>
                    <option value="1">Note</option>
                    <option value="2">Page</option>
                    <option value="3">Code</option>
                </select>
                
                <label>Default Editor Theme</label>
                <span className="input-description">
                    Theme initially set for Code and Page editors.
                </span>
                <select
                    ref="default-editor-theme"
                    defaultValue={c.defaultEditorTheme}
                >{
                    themes.map((theme, i) =>
                        <option value={i}>{theme[0]}</option>
                    )
                }</select>
                
                <label>Default Code Syntax</label>
                <span className="input-description">
                    Syntax initially set for Code editor.
                </span>
                <select
                    ref="default-code-syntax"
                    defaultValue={c.defaultCodeSyntax}
                >{
                    syntaxes.map((syntax, i) =>
                        <option value={i}>{syntax[0]}</option>
                    )
                }</select>
                
                <label>Default Page View</label>
                <span className="input-description">
                    View initially set when a Page document is opened.
                </span>
                <select
                    ref="default-page-view"
                    defaultValue={c.defaultPageView}
                >
                    <option value="edit">Editor</option>
                    <option value="preview">Preview</option>
                </select>
                
                <label>Editor Font Size</label>
                <span className="input-description">
                    Font size for Page and Code editors.
                </span>
                <span 
                    className="editor-font-size-example"
                    style={{
                        fontSize: c.editorFontSize
                            ? (c.editorFontSize + "em") : "1em"
                    }}
                    ref="editor-font-size-example"
                >
                    Font Size Example
                </span>
                <input 
                    ref="editor-font-size"
                    type="number"
                    defaultValue={c.editorFontSize}
                    onChange={() => {
                        this.refs["editor-font-size-example"].style.fontSize
                            = this.refs["editor-font-size"].value + "em";
                    }}
                />
                
                <label>Dark Theme</label>
                <span className="input-description">
                    A dark theme for the entire site.
                    <br />
                    Be sure to also set a dark editor theme as default.
                </span>
                <input 
                    type="checkbox"
                    ref="dark-theme"
                    defaultChecked={!!c.darkTheme}
                />Enable
                
                <button className="btn-primary">Update Configuration</button>
            </form>
		);
	}

}