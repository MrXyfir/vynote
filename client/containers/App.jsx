import { Component } from "react";
import { Render } from "react-dom";

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

// Create store and socket connection
let store = createStore(reducers);
let socket = io(store);

class App extends Component {

    constructor(props) {
        super(props);

        store.subscribe(() => {
            this.setState(store.getState());
        });
        
        // Begin building initial state object
        let state = {
            explorer: {}, document: {
                doc_type: 0, doc_id: 0
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
        socket.emit("get filesystem", (res) => {
           state.explorer = buildExplorerObject(res);
            
           socket.emit("get user info", (res) => {
               state.user = res;
               state.user.config = JSON.parse(res.user.config);
               
               this.state = state;
               
               // Push initial state to store
               store.dispatch({
                   type: INITIALIZE_STATE, state
               });
           });
        });
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

Render(<App />, document.querySelector("#content"));