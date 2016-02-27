import { Component } from "react";

// Action creators
import {
	loadContributors, addContributor, removeContributor,
	setPermissions, selectContributor
} from "../../../actions/modal/document-controls/contributors";
import {
	error, success
} from "../../../actions/notification";

export default class VersionControl extends Component {

	constructor(props) {
		super(props);
	}
	
	componentWillMount() {
		this.props.emit("list contributors", this.props.data.document.doc_id, contributors => {
			this.props.dispatch(loadContributors(contributors));
		});
	}
	
	onAddContributor(email) {
		this.props.emit(
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
	
		this.props.emit(
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
		this.dispatch(selectContributor(user));
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
	
		this.props.emit("set user permissions", data, (err) => {
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
		if (this.props.data.modal.selectedContributor != undefined) {
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
						<input type="checkbox" defaultValue={user.can_write} ref="permWrite" />Write
						<input type="checkbox" defaultValue={user.can_update} ref="permUpdate" />Update
						<input type="checkbox" defaultValue={user.can_delete} ref="permDelete" />Delete
						
						<button onClick={this.onSetPermissions}>Set Permissions</button>
					</div>
					
					<button onClick={this.onRemoveContributor} className="btn-danger">
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