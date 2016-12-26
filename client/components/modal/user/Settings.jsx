import React from "react";

// Action creators
import {
    setConfig, createShortcut, deleteShortcut
} from "actions/user/index";
import { error, success } from "actions/notification";

// Constants
import { themes, syntaxes } from "constants/editor";
import colors from "constants/colors";

export default class Settings extends React.Component {

	constructor(props) {
		super(props);
        
        this.onUpdateConfiguration = this.onUpdateConfiguration.bind(this);
        this.onCreateShortcut = this.onCreateShortcut.bind(this);
	}
    
    onUpdateConfiguration() {
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
    
    onCreateShortcut() {
        let name = this.refs.name.value;
        let msg = this.refs.message.value;
        
        this.props.socket.emit("create shortcut", name, msg, (err, res) => {
            if (err) {
                this.props.dispatch(error(res));
            }
            else {
                this.props.dispatch(success(`Shortcut '${name}' created`));
                this.props.dispatch(createShortcut(name, msg));
            }
        });
    }
    
    onDeleteShortcut(name) {
        this.props.socket.emit("delete shortcut", name, (err) => {
            if (err) {
                this.props.dispatch(error());
            }
            else {
                this.props.dispatch(success(`Shortcut '${name}' deleted`));
                this.props.dispatch(deleteShortcut(name));
            }
        });
    }
	
	render() {
        let c = this.props.data.user.config;
        let s = this.props.data.user.shortcuts || {};
        
		return (
			<div className="user-settings">
                {
                    Date.now() > this.props.data.user.subscription
                    ? (
                        <span><span className="icon-info" /> Only premium members can modify their configuration and create shortcuts.</span>
                    )
                    : (<span />)
                }
            
                <h3>Configuration</h3>
				<div className="config">
                    <label>Default Explorer Object Color</label>
                    <span className="input-description">This color will automatically be set when creating a document or folder.</span>
                    <select
                        ref="default-explorer-color"
                        defaultValue={c.defaultExplorerObjectColor}
                    >{
                        colors.map((color, i) => {
                            return <option value={i}>{color}</option>
                        })
                    }</select>
                    
                    <label>Default Document Type</label>
                    <span className="input-description">This type will automatically be set when creating a document or folder.</span>
                    <select ref="default-document-type" defaultValue={c.defaultDocumentType}>
                        <option value="0">Document Type</option>
                        <option value="1">Note</option>
                        <option value="2">Page</option>
                        <option value="3">Code</option>
                    </select>
                    
                    <label>Default Editor Theme</label>
                    <span className="input-description">Theme initially set for Code and Page editors.</span>
                    <select
                        ref="default-editor-theme"
                        defaultValue={c.defaultEditorTheme}
                    >{
                        themes.map((theme, i) => {
                            return (
                                <option value={i}>{theme[0]}</option>
                            );
                        })
                    }</select>
                    
                    <label>Default Code Syntax</label>
                    <span className="input-description">Syntax initially set for Code editor.</span>
                    <select
                        ref="default-code-syntax"
                        defaultValue={c.defaultCodeSyntax}
                    >{
                        syntaxes.map((syntax, i) => {
                            return (
                                <option value={i}>{syntax[0]}</option>
                            );
                        })
                    }</select>
                    
                    <label>Default Page View</label>
                    <span className="input-description">View initially set when a Page document is opened.</span>
                    <select
                        ref="default-page-view"
                        defaultValue={c.defaultPageView}
                    >
                        <option value="edit">Editor</option>
                        <option value="preview">Preview</option>
                    </select>
                    
                    <label>Editor Font Size</label>
                    <span className="input-description">Font size for Page and Code editors.</span>
                    <span 
                        className="editor-font-size-example"
                        style={{
                            fontSize: c.editorFontSize + "em" || "1em"
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
                    
                    <button className="btn-primary" onClick={this.onUpdateConfiguration}>
                        Update Configuration
                    </button>
                </div>
                
                <h3>Shortcuts</h3>
                <p>Shortcuts allow you to save a long string of text as a short keyword that you can use throughout any of your documents. Simply type <b>{"${shortcut_name}"}</b> in any document and it will be replaced with the text you saved.</p>
                <div className="shortcuts">
                    <div className="create">
					<input type="text" ref="name" placeholder="Shortcut Name" />
					<span 
						className="icon-add" 
						onClick={this.onCreateShortcut} 
						title="Create Shortcut"
					/>
                    <textarea ref="message" defaultValue="Shortcut Message" />
				</div>
				<div className="list">{
					Object.keys(s).map((shortcut) => {
						return (
							<div className="item">
								<span className="name">
                                    <span 
										title="Delete Version" 
										className="icon-trash" 
										onClick={this.onDeleteShortcut.bind(this, shortcut)}
									/>
                                    {shortcut}
                                </span>
                                <p className="message">{s[shortcut]}</p>
							</div>
						);
					})
				}</div>
                </div>
			</div>
		);
	}

}