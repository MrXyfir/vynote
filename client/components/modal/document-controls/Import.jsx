import React from "react";

// Action creators
import { error, success } from "../../../actions/notification";
import { loadContent } from "../../../actions/documents/";
import { close } from "../../../actions/modal/";
import { initializeRenderObject } from "../../../actions/documents/note";

// Components
import Editor from "../../documents/Editor";

// Modules
import buildNoteObject from "../../../../lib/notes-convert/to-object";

export default class Import extends React.Component {

	constructor(props) {
		super(props);
        
        this.onImport = this.onImport.bind(this);
	}
	
	onImport() {
		if (Date.now() > this.props.data.user.subscription) {
			this.props.dispatch(error("Free members cannot import documents"));
			return;
		}
		
		if (this.props.data.document.doc_type == 1) {
			this.props.socket.emit(
				"import notes", this.props.data.document.doc_id, 
				this.refs.ace.editor.session.doc.getAllLines(),
				(err, msg) => {
					if (err) {
						this.props.dispatch(error("An unknown error occured"));
					}
					else {
						this.props.socket.emit(
							"get note object",
							this.props.data.document.doc_id,
							this.props.data.document.encrypt,
							(err, res) => {
                                location.reload();
							}
						);
					}
				}
			);
		}
		else {
			let data = {
				doc: this.props.data.document.doc_id,
				action: "OVERWRITE",
				content: this.refs.ace.editor.getValue()
			};
			
			this.props.socket.emit("update document content", data, (err) => {
				location.reload();
			});
		}
	}

	render() {
		const data = {
			encrypted: false,
			content: "",
			syntax: this.props.data.document.syntax === undefined ? 70 : this.props.data.document.syntax,
			theme: this.props.data.document.theme === undefined ? 6 : this.props.data.document.theme,
		};
	
		return (
			<div className="document-import">
				<p>
					Drag and drop a file or copy and paste text into the editor below. When you're ready, click 'Import'. Any content in the document will be written over with the imported data. 
				</p>
				
				<Editor
					onChange={() => {return;}}
                    user={this.props.data.user} 
					data={data}
					ref="ace"
					id="ace-import"
				/>
				
				<button onClick={this.onImport} className="btn-primary">Import</button>
			</div>
		);
	}

}