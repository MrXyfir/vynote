import React from "react";

import { navigateToFolder } from "../../actions/explorer/";

export default class DirectoryAddress extends React.Component {

    constructor(props) {
        super(props);
    }

	navigateToParent(id) {
		this.props.dispatch(navigateToFolder(id));
	}

	render() {
		// Only output last 3 parent folder names
		let parents = this.props.data.scopeParents.splice(-3); 
	
		return (
			<div className="explorer-directory-address">{
				parents.map(dir => {
					return (
						<span 
							className="explorer-directory-address-item" 
							onClick={this.navigateToParent.bind(this, dir.id)}
						>{
							dir.name + "/"
						}</span>
					);
				})
			}</div>
		);
	}

}