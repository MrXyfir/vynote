import React from "react";

// Action creators
import {
	loadContributors, addContributor, removeContributor,
	setPermissions, selectContributor
} from "actions/modal/document-controls/contributors";
import {
	error, success
} from "actions/notification";

export default class VersionControl extends React.Component {

	constructor(props) {
		super(props);
        
        this.onRemoveContributor = this.onRemoveContributor.bind(this);
        this.onSelectContributor = this.onSelectContributor.bind(this);
        this.onSetPermissions = this.onSetPermissions.bind(this);
        this.onAddContributor = this.onAddContributor.bind(this);
	}
	
	componentWillMount() {
		this.props.socket.emit("list contributors", this.props.data.document.doc_id, (err, contributors) => {
            if (err){
                this.props.dispatch(loadContributors([]));
                this.props.dispatch(error("Could not load contributors"));
            }
            else {
                this.props.dispatch(loadContributors(contributors));
            }
		});
	}
	
	onAddContributor() {
        const email = this.refs.email.value;
        
		this.props.socket.emit(
			"add contributor", this.props.data.document.doc_id, email,
			(err, res) => {
				if (err) {
					this.props.dispatch(error(res));
				}
				else {
					this.props.dispatch(addContributor(email, res));
					this.props.dispatch(success(`Added contributor '${email}'`));
				}
			}
		);
	}
	
	onRemoveContributor() {
		let user = this.props.data.modal.selectedContributor;
	
		this.props.socket.emit(
			"remove contributor", this.props.data.document.doc_id, user,
			(err) => {
				if (err) {
					this.props.dispatch(error("Error removing contributor"));
				}
				else {
					this.props.dispatch(removeContributor(user));
					this.props.dispatch(success(`Removed contributor`));
				}
			}
		);
	}
	
	onSelectContributor(user) {
		this.props.dispatch(selectContributor(user));
	}
	
	onSetPermissions() {
		let user = this.props.data.modal.selectedContributor;
		
		let data = {
			doc: this.props.data.document.doc_id, user,
			permissions: {
				update: this.refs.permUpdate.checked,
				delete: this.refs.permDelete.checked,
				write: this.refs.permWrite.checked
			}
		};
	
		this.props.socket.emit("set user permissions", data, (err) => {
			if (err) {
				this.props.dispatch(error("Error setting permissions"));
			}
			else {
				this.props.dispatch(setPermissions(data));
				this.props.dispatch(success("Permissions updated successfully"));
			}
		});
	}
	
	render() {
		if (this.props.data.modal.contributors == undefined) {
			return (
				<div className="loading">
					<span className="icon-loading" />
					<span>Loading document contributors</span>
				</div>
			);
		}
		
		let selectedContributor;
		if (!!this.props.data.modal.selectedContributor) {
			let user;
			this.props.data.modal.contributors.forEach(contributor => {
				if (contributor.user_id == this.props.data.modal.selectedContributor) {
					user = contributor;
				}
			});
            
			selectedContributor = (
				<div className="document-contributor-selected">
					<h3 className="user-email">{user.email}</h3>
					<div className="user-permissions">
						<input type="checkbox" defaultChecked={user.permission.write} ref="permWrite" />Write
						<input type="checkbox" defaultChecked={user.permission.update} ref="permUpdate" />Update
						<input type="checkbox" defaultChecked={user.permission.delete} ref="permDelete" />Delete
					</div>
					
                    <button onClick={this.onSetPermissions} className="btn-sm btn-primary">
                        Set Permissions
                    </button>
					<button onClick={this.onRemoveContributor} className="btn-sm btn-danger">
						Remove Contributor
					</button>
				</div>
			);
		}
	
		return (
			<div className="document-contributors">
				<h3>What are document contributors?</h3>
				<p>
					Utilizing our document contributors system allows you to work with multiple other users on the same document. You can also control a user's permissions to dictate what actions they're able to perform on any given document.
				</p>
			
				<div className="document-contributor-add">
					<input type="text" ref="email" placeholder="user@email.com" />
					<span 
						className="icon-add" 
						onClick={this.onAddContributor} 
						title="Add Contributor"
					/>
				</div>
				
				{selectedContributor}
				
				<div className="document-contributor-list">{
					this.props.data.modal.contributors.map(user => {
						let selected = this.props.data.modal.selectedContributor == user.user_id
							? " selected" : "";
						return (
							<div className={"document-contributor-list-user" + selected}>
								<a onClick={this.onSelectContributor.bind(this, user.user_id)}>
									{user.email}
								</a>
							</div>
						);
					})
				}</div>
			</div>
		);
	}

}