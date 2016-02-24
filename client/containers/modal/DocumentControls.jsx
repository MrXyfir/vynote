import { Component } from "react";

// Components
import VersionControl from "../../components/documents/controls/VersionControl";
import Contributors from "../../components/documents/controls/Contributors";
import Export from "../../components/documents/controls/Export";
import Import from "../../components/documents/controls/Import";

export default class DocumentControls extends Component {

	constructor(props) {
		super(props);
	}
	
	onClickTab(tab) {
		switch(tab) {
			case 1: return;
			case 2: return;
			case 3: return;
			case 4: return;
		}
	}

	render() {
		let view;
		switch(this.props.data.modal.action.split('/')[2]) {
			case "CONTRIBUTORS":
				view = (
					<Contributors
						data={this.props.data} 
						emit={this.props.emit} 
						dispatch={this.props.dispatch}
					/>
				); break;
				
			case "EXPORT":
				view = (
					<Export
						data={this.props.data} 
						emit={this.props.emit} 
						dispatch={this.props.dispatch}
					/>
				); break;
				
			case "IMPORT":
				view = (
					<Import
						data={this.props.data} 
						emit={this.props.emit} 
						dispatch={this.props.dispatch}
					/>
				); break;
				
			default:
				view = (
					<VersionControl
						data={this.props.data} 
						emit={this.props.emit} 
						dispatch={this.props.dispatch}
					/>
				);
		}
	
		return (
			<div className="document-controls">
				<div className="tabs">
					<span onClick={() => {this.onClickTab(1)}}>Version Control</span>
					{
						this.props.data.document.contributor
						? <span className="tab-hidden" />
						: <span onClick={() => {this.onClickTab(2)}}>Contributors</span> 
					}
					<span onClick={() => {this.onClickTab(3)}}>Export</span>
					{
						this.props.data.document.doc_type == 1
						? <span onClick={() => {this.onClickTab(4)}}>Import</span>
						: <span className="tab-hidden" /> 
					}
				</div>
				{view}
			</div>
		);
	}

}