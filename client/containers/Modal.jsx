import { Component } from "react";

// Sub-Containers
import DocumentControls from "./modal/DocumentControls";

// Actions
import { close } from "../actions/modal";

export default class Modal extends Component {

	constructor(props) {
		super(props);
	}

	onClose() {
		this.props.dispatch(close);
	}

	render() {
		if (this.props.data.modal.action === "") {
			return <div />;
		}
		
		let view;
		switch (this.props.data.model.action.split('/')[1]) {
			case "DOCUMENT_CONTROLS":
				view = (
					<DocumentControls 
						data={this.props.data} 
						emit={this.props.emit} 
						dispatch={this.props.dispatch}
					/>
				); break;
				
			default;
				return <div />;
		}
	
		return (
			<div className="modal">
				<span className="icon-close" title="Close" onClick={this.onClose} />
				{view}
			</div>
		);
	}

}