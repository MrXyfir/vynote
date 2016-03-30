import React from "react";

// Components
import DocumentFinder from "../../contained/explorer/DocumentFinder";

// Action creators
import { error, success } from "../../../actions/notification";
import { loadTemplate } from "../../../actions/modal/document-controls/templates";
import { loadContent, toggleMarkForReload } from "../../../actions/documents/";
import { initializeRenderObject } from "../../../actions/documents/note";

// Modules
import buildNoteObject from "../../../lib/note/build";
import { encrypt } from "../../../lib/crypto";

export default class Templates extends React.Component {

	constructor(props) {
		super(props);
        
        this.onSelectTemplate = this.onSelectTemplate.bind(this);
        this.onLoadTemplate = this.onLoadTemplate.bind(this);
	}
	
    onSelectTemplate(id) {
        let doc = this.props.data.explorer.documents[id];
        
        // Load document's content
        this.props.socket.emit(doc.doc_type == 1 ? "get note object" : "get document content", id, "", (err, res) => {
            let regex = new RegExp("\{\{([A-Za-z0-9_]{1,})\}\}", 'g');
            let vars  = [];
            
            if (err) {
                this.props.dispatch(error(res));
                return;
            }
            // Get variables in note elements
            else if (doc.doc_type == 1) {
                res = buildNoteObject(res.content, res.changes);
                
                Object.keys(res).forEach(note => {                    
                    vars = vars.concat(res[note].content.match(regex) || []);
                });
            }
            // Get variables in normal text content
            else {
                vars = res.match(regex) || [];
            }
            
            // Clean variables
            vars = vars.map(variable => {
                return variable.substr(2).substr(0, variable.length - 4);
            }); 
            
            // Load id, vars, content into state.modal
            this.props.dispatch(loadTemplate(id, vars, res));
            
            // Close document if not open
            if (this.props.data.explorer.tabs.list[id] === undefined)
                this.props.socket.emit("close document", id);
        })
    }
    
    onLoadTemplate() {
        let newContent;
        
        // Set variables in template with user-defined values
        if (this.props.data.modal.variables !== undefined && this.props.data.modal.variables.length) {
            if (this.props.data.document.doc_type == 1) {
                newContent = Object.assign({}, this.props.data.modal.content);
                
                Object.keys(newContent).forEach(id => {
                    this.props.data.modal.variables.forEach(variable => {
                        newContent[id].content = newContent[id].content.replace(
                            `{{${variable}}}`, this.refs[`var-${variable}`].value
                        );
                    });
                });
            }
            else {
                newContent = this.props.data.modal.content;
                
                this.props.data.modal.variables.forEach(variable => {
                    newContent = newContent.replace(
                        `{{${variable}}}`, this.refs[`var-${variable}`].value
                    );
                });
            }
        }
        
        // Update current document
        if (this.props.data.document.doc_type === 1) {
            let note = Object.assign({}, newContent);
            
            if (this.props.data.document.encrypted) {
                Object.keys(note).forEach(id => {
                    note[id].content = encrypt(
                        note[id].content, this.props.data.document.encrypt
                    );
                })
            }
            
            note = JSON.stringify(note);
            
            // Overwrite document's entire note object
            this.props.socket.emit("set note object", this.props.data.document.doc_id, note, (err) => {
                if (err) {
                    this.props.dispatch(error("An unknown error occured"));
                }
                else {
                    this.props.dispatch(loadContent(newContent));
                    this.props.dispatch(initializeRenderObject());
                }
            });
        }
        else {
            // Encrypt final content if document is encrypted
            if (this.props.data.document.encrypted && this.props.data.document.doc_type !== 1)
                newContent = encrypt(newContent, this.props.data.document.encrypt);
            
            this.props.dispatch(loadContent(newContent));
            this.props.dispatch(toggleMarkForReload());
        }
    }
    
	render() {
        if (Date.now() > this.props.data.user.subscription) {
            return <p>Free members cannot use templates.</p>;
        }
        
		return (
			<div className="document-templates">
				<p>
                    Templates allow you to load the content of other documents into the currently open document. Optional variables make it easy to load data into templates. More information on templates can be found in the <strong>Help</strong> menu.
                </p>
                
                <DocumentFinder
                    types={[this.props.data.document.doc_type]}
                    onSelect={this.onSelectTemplate}
                    explorer={this.props.data.explorer}
                />
                
                {
                    this.props.data.modal.variables !== undefined && this.props.data.modal.variables.length
                    ? (
                        <div className="variables">{
                            this.props.data.modal.variables.map(variable => {
                                return <input type="text" placeholder={variable} ref={`var-${variable}`} />;
                            })
                        }</div>
                    )
                    : <div />
                }
                
                {
                    this.props.data.modal.template
                    ? <button className="btn-primary" onClick={this.onLoadTemplate}>Load Template</button>
                    : <span />
                }
			</div>
		);
	}

}