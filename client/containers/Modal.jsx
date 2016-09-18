import React from "react";

// Sub-Containers
import DocumentControls from "./modal/DocumentControls";
import User from "./modal/User";

// Components
import Ad from "components/modal/Ad";

// Actions
import { close } from "actions/modal";

export default class Modal extends React.Component {

	constructor(props) {
		super(props);
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
                view = <Ad data={this.props.data.modal.ad} />; break;
				
			default:
				return <div />;
		}
	
		return (
			<div className={
				"modal" + (this.props.data.view != "all" ? " full" : "")
			}>
				<span
					className="icon-close"
					onClick={() => this.props.dispatch(close())}
					title="Close"
				/>
				{view}
			</div>
		);
	}

}