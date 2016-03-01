﻿import React from "react";
import { render } from "react-dom";

// Redux store / reducers
import { createStore } from "redux";
import reducers from "../reducers/";

// React container components
import Explorer from "./Explorer";
import Document from "./Document";
import Modal from "./Modal";

// Non-container React componenents
import Notification from "../components/Notification";

// io returns a socket.io connection after creating event listeners
import io from "../sockets/";

// Modules
import buildExplorerObject from "../lib/explorer/build";

// Constants
import { INITIALIZE_STATE } from "../constants/action-types/";
import { URL, XACC } from "../constants/config.js";

// Create store and socket connection
let store = createStore(reducers);
let socket = io(store);

class App extends React.Component {

    constructor(props) {
        super(props);

        store.subscribe(() => {
            this.setState(store.getState());
        });
        
        if (location.href.indexOf("http://localhost") == 0) {
            store.subscribe(() => {
                console.log(store.getState());
            });
        }
        
        const initialize = () => {
            // Begin building initial state object
            let state = {
                explorer: {}, document: {
                    doc_type: 0, doc_id: 0, folder_id: 0
                },
                modal: {
                    action: ""
                },
                notification: {
                    status: "", message: ""
                },
                user: {
                    shortcuts: {}, config: {}, subscription: 0
                }
            };
            
            // Grab filesystem and user objects
            socket.emit("get user info", (isLoggedIn, data) => {
                if (!isLoggedIn) {
                    location.href = XACC + "login/12";
                }
                
                state.user = data;
                state.user.config = JSON.parse(data.config);
                
                socket.emit("get filesystem", (data) => {
                    state.explorer = buildExplorerObject(data);
                    
                    this.state = state;
                    
                    // Push initial state to store
                    store.dispatch({
                        type: INITIALIZE_STATE, state
                    });
                });
            });
        };
        
        // Attempt to login using XID/AUTH or skip to initialize()
        if (location.href.indexOf("xid=") > -1 && location.href.indexOf("auth=") > -1) {
            // Login using XID/AUTH_TOKEN
            let xid = location.href.substring(
                location.href.lastIndexOf("?xid=") + 5,
                location.href.lastIndexOf("&auth")
            );
            let auth = location.href.substring(
                location.href.lastIndexOf("&auth=") + 6
            );
            
            socket.emit("login user", xid, auth, (err) => {
                if (err) {
                    location.href = XACC + "login/12";
                }
                else {
                    initialize();
                    history.pushState({}, '', URL + "workspace/");
                }
            });
        }
        else {
            initialize();
        }
    }

    dispatch(action) {
        // Dispatches an action
        store.dispatch(action);
    }

    emit() {
        // Emits a socket event
        socket.emit.apply(null, Array.prototype.slice.call(arguments));
    }

    render() {
        if (this.state == undefined) {
            return <span className="icon-loading" />;
        }
        
        return (
            <div>
                <Explorer 
                    data={this.state.explorer} 
                    user={this.state.user} 
                    emit={this.emit} 
                    dispatch={this.dispatch}
                />
                <Document 
                    data={this.state.document} 
                    emit={this.emit} 
                    folders={this.state.explorer.folders} 
                    dispatch={this.dispatch}
                />
                <Modal
                    data={this.state} 
                    emit={this.emit} 
                    dispatch={this.dispatch}
                />
                <Notification data={this.state.notification} dispatch={this.dispatch} />
            </div>
        );
    }

}

render(<App />, document.querySelector("#content"));