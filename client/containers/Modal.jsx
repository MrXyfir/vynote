import React from "react";

// Sub-Containers
import DocumentControls from "./modal/DocumentControls";
import User from "./modal/User";

// Components
import Ad from "../components/modal/Ad";

// Actions
import { close } from "../actions/modal";

export default class Modal extends React.Component {

	constructor(props) {
		super(props);
        
        this.onClose = this.onClose.bind(this);
	}

	onClose() {
		this.props.dispatch(close());
	}

	render() {
		if (this.props.data.modal.action === "") {
			return <div />;
		}
		
		let view;
		switch (this.props.data.modal.action.split('/')[1]) {
			case "DOCUMENT_CONTROLS":
				view = (
					<DocumentControls 
						data={this.props.data} 
						socket={this.props.socket} 
						dispatch={this.props.dispatch}
					/>
				); break;
                
            case "USER":
                view = (
                    <User
                        data={this.props.data}
                        socket={this.props.socket}
                        dispatch={this.props.dispatch}
                    />
                ); break;
                
            case "ADVERTISEMENT":
                view = <Ad data={this.props.data.modal} />; break;
				
			default:
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