import { Component } from "react";

// Action creators
import {
	error, success
} from "../../../actions/notification";
import {
	loadContent
} from "../../../actions/documents/";
import {
	close
} from "../../../actions/modal/";

// Components
import Editor from "../../documents/Editor";

// Modules
import buildNoteObject from "../../../../lib/notes-convert/to-object";

export default class Import extends Component {

	constructor(props) {
		super(props);
	}
	
	onImport() {
		if (Date.now() > this.props.user.subscription) {
			this.props.dispatch(error("Free members cannot import documents"));
			return;
		}
		
		if (this.props.data.document.doc_type == 1) {
			this.props.emit(
				"import notes", this.props.data.document.doc_id, 
				this.refs.ace.editor.getValue().split("\r\n"),
				(err, msg) => {
					if (err) {
						this.props.dispatch(error(msg || "An unknown error occured"));
					}
					else {
						this.props.emit(
							"get note elements",
							this.props.data.document.doc_id,
							this.props.data.document.encrypt,
							(err, res) => {
								if (err) {
									location.reload();
								}
								else {
									this.props.dispatch(loadContent(
										buildNoteObject(res)
									));
									this.props.dispatch(success("Notes imported"));
								}
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
			
			this.props.emit("update document content", data, (err) => {
				if (err) {
					location.reload();
				}
				else {
					this.props.dispatch(loadContent(data.content));
					this.props.dispatch(close());
					this.props.dispatch(success("Document content imported"));
				}
			});
		}
	}

	render() {
		const data = {
			encrypted: false,
			content: "",
			syntax: this.props.data.document.syntax || 69,
			theme: this.props.data.document.theme || 6,
		};
	
		return (
			<div className="document-import">
				<p>
					Drag and drop a file or copy and paste text into the editor below. When you're ready, click 'Import'. Any content in the document will be written over with the imported data. 
				</p>
				
				<Editor 
					onChange={() => {return;}} 
					data={data} 
					ref="ace" 
					id="ace-import"
				/>
				
				<button onClick={this.onImport} className="btn-primary">Import</button>
			</div>
		);
	}

}