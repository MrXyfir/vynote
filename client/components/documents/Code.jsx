import React from "react";

// Action creators
import { setSyntax, setTheme } from "actions/documents/code";
import { themes, syntaxes } from "constants/editor";

// Components
import Editor from "./Editor";

export default class CodeDocument extends React.Component {
    
    constructor(props) {
        super(props);
        
        this.onSetSyntax = this.onSetSyntax.bind(this);
        this.onSetTheme = this.onSetTheme.bind(this);
        this.onChange = this.onChange.bind(this);
    }
    
    onSetSyntax() {
        const syntax = +this.refs.syntax.value; 
        
        this.props.socket.emit(
            "set document syntax", this.props.data.doc_id, syntax,
            (err) => { if (!err) this.props.dispatch(setSyntax(syntax)); }
        );
    }
    
    onSetTheme() {
        this.props.dispatch(setTheme(+this.refs.theme.value));
    }
    
    render() {
        return (
            <div className="document document-code">
                {this.props.data.showEditorSettings ? (
                    <div className="editor-settings">
                        <label>Syntax</label>
                        <select
                            ref="syntax"
                            onChange={this.onSetSyntax}
                            defaultValue={this.props.data.syntax}
                        >{
                            syntaxes.map((syntax, i) =>
                                <option value={i}>{syntax[0]}</option>
                            )
                        }</select>
                        
                        <label>Theme</label>
                        <select
                            ref="theme"
                            onChange={this.onSetTheme}
                            defaultValue={this.props.data.theme}
                        >{
                            themes.map((theme, i) =>
                                <option value={i}>{theme[0]}</option>
                            )
                        }</select>
                    </div>
                ) : (
                    <div />
                )}
                
                <Editor {...this.props} />
            </div>
        );
    }
    
}