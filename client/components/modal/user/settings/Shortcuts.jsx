import React from "react";

// Action creators
import { createShortcut, deleteShortcut } from "actions/user/index";
import { error, success } from "actions/notification";

export default class Settings extends React.Component {

	constructor(props) {
		super(props);
	}
    
    onCreateShortcut() {
        let name = this.refs.name.value;
        let msg = this.refs.message.value;
        
        this.props.socket.emit("create shortcut", name, msg, (err, res) => {
            if (err) {
                this.props.dispatch(error(res));
            }
            else {
                this.props.dispatch(success(`Shortcut '${name}' created`));
                this.props.dispatch(createShortcut(name, msg));
            }
        });
    }
    
    onDeleteShortcut(name) {
        this.props.socket.emit("delete shortcut", name, (err) => {
            if (err) {
                this.props.dispatch(error());
            }
            else {
                this.props.dispatch(success(`Shortcut '${name}' deleted`));
                this.props.dispatch(deleteShortcut(name));
            }
        });
    }
	
	render() {
        const s = this.props.data.user.shortcuts || {};
        
        return (
			<div className="shortcuts">
                <p>
                    Shortcuts allow you to save a long string of text as a short keyword that you can use throughout any of your documents. Simply type <code>{"${shortcut_name}"}</code> in any document and it will be replaced with the text you saved.
                </p>
                
                <div className="create">
					<input type="text" ref="name" placeholder="Shortcut Name" />
					
                    <span 
						className="icon-add" 
                        onClick={() => this.onCreateShortcut()}
						title="Create Shortcut"
					/>
                    <textarea ref="message" defaultValue="Shortcut Message" />
				</div>
				
                <div className="list">{
					Object.keys(s).map((shortcut) =>
                        <div className="item">
                            <span className="name">
                                <a
                                    title="Delete shortcut" 
                                    className="icon-trash" 
                                    onClick={() =>
                                        this.onDeleteShortcut(shortcut)
                                    }
                                />
                                {shortcut}
                            </span>
                            <p className="message">{s[shortcut]}</p>
                        </div>
					)
				}</div>
			</div>
		);
	}

}