import React from "react";

// Components
import VersionControl from "../../components/modal/document-controls/VersionControl";
import Contributors from "../../components/modal/document-controls/Contributors";
import Templates from "../../components/modal/document-controls/Templates";
import Export from "../../components/modal/document-controls/Export";
import Import from "../../components/modal/document-controls/Import";

// Action types
import {
    VERSIONS, CONTRIBUTORS, IMPORT, EXPORT, TEMPLATES
} from "../../constants/action-types/modal/document-controls/";

// Action creators
import { changeTab } from "../../actions/modal/document-controls/";

export default class DocumentControls extends React.Component {

	constructor(props) {
		super(props);
	}
	
	onClickTab(tab) {
		switch(tab) {
			case 1: return this.props.dispatch(changeTab(VERSIONS));
			case 2: return this.props.dispatch(changeTab(CONTRIBUTORS));
			case 3: return this.props.dispatch(changeTab(EXPORT));
			case 4: return this.props.dispatch(changeTab(IMPORT));
            case 5: return this.props.dispatch(changeTab(TEMPLATES));
		}
	}

	render() {
		let view;
		switch(this.props.data.modal.action.split('/')[2]) {
			case "CONTRIBUTORS":
				view = (
					<Contributors
						data={this.props.data}
						socket={this.props.socket}
						dispatch={this.props.dispatch}
					/>
				); break;
				
			case "EXPORT":
				view = (
					<Export
						data={this.props.data}
						socket={this.props.socket}
						dispatch={this.props.dispatch}
					/>
				); break;
				
			case "IMPORT":
				view = (
					<Import
						data={this.props.data}
						socket={this.props.socket}
						dispatch={this.props.dispatch}
					/>
				); break;
                
            case "TEMPLATES":
                view = (
                    <Templates
                        data={this.props.data}
						socket={this.props.socket}
						dispatch={this.props.dispatch}
                    />
                ); break;
				
			default:
				view = (
					<VersionControl
						data={this.props.data}
						socket={this.props.socket}
						dispatch={this.props.dispatch}
					/>
				);
		}
	
		return (
			<div className="document-controls">
				<div className="tabs">
					<a onClick={this.onClickTab.bind(this, 1)}>Version Control</a>
					{
						this.props.data.document.contributor
						? <a className="tab-hidden" />
						: <a onClick={this.onClickTab.bind(this, 2)}>Contributors</a> 
					}
					<a onClick={this.onClickTab.bind(this, 3)}>Export</a>
					<a onClick={this.onClickTab.bind(this, 4)}>Import</a>
				</div>
				{view}
			</div>
		);
	}

}