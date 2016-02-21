import { Component } from "react";
import { Render } from "react-dom";

// Redux store / reducers
import { createStore } from "redux";
import reducers from "../reducers/";

// React container components
import Explorer from "./Explorer";
import Settings from "./Settings";
import Document from "./Document";

// Non-container React componenents
import Notification from "../components/Notification";

// io returns a socket.io connection after creating event listeners
import io from "../sockets/";

// Create store and socket connection
let store = createStore(reducers);
let socket = io(store);

class App extends Component {

    constructor(props) {
        super(props);

        this.state = store.getState();
        store.subscribe(() => {
            this.setState(store.getState());
        });
    }

    dispatch(action) {
        // Dispatches an action
        store.dispatch(action);
    }

    emit() {
        // Emits a socket event
        socket.emit.apply(null, [].concat(Array.prototype.slice.call(arguments)));
    }

    render() {
        return (
            <div>
                <Explorer 
                    data={this.state.explorer} 
                    user={this.state.user} 
                    emit={this.emit} 
                    dispatch={this.dispatch}
                ></Explorer>
                <Document 
                    data={this.state.document} 
                    emit={this.emit} 
                    dispatch={this.dispatch}
                ></Document>
                <Notification data={this.state.notification}></Notification>
            </div>
        );
    }

}

Render(<App />, document.querySelector("#content"));