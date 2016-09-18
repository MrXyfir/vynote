import React from "react";
import { render } from "react-dom";

// Redux store / reducers
import { createStore } from "redux";
import reducers from "reducers/index";

// React container components
import Explorer from "./Explorer";
import Document from "./Document";
import Modal from "./Modal";

// Non-container React componenents
import Notification from "components/status-bar/Notification";
import QuickLinks from "components/status-bar/QuickLinks";

// io returns a socket.io connection after creating event listeners
import io from "sockets/index";

// Modules
import buildExplorerObject from "lib/explorer/build";
import generateAds from "lib/ad/generate";
import parseQuery from "lib/route/parse-query";
import setRoute from "lib/route/set-route";
import setState from "lib/route/set-state";

// Constants
import { INITIALIZE_STATE } from "constants/action-types/index";
import { URL, XACC, LOG_STATE } from "constants/config";
import userConfig from "constants/user-config";

// Create store and socket connection
let store = createStore(reducers);
let socket = io(store);

class App extends React.Component {

    constructor(props) {
        super(props);

        store.subscribe(() => {
            this.setState(store.getState());
        });
        
        store.subscribe(() => {
            setRoute(store.getState().document);
        });
        
        if (LOG_STATE) {
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
                    status: "clear", message: ""
                },
                user: {
                    shortcuts: {}, config: {}, subscription: 0
                }
            };
            
            // Grab filesystem and user objects
            socket.emit("get user info", (isLoggedIn, data) => {
                if (!isLoggedIn) {
                    location.href = XACC + "app/#/login/12";
                }
                
                state.user = data;
                state.user.config = JSON.parse(data.config || "{}");
                
                // Load user's set config or default configuration
                state.user.config = Object.keys(state.user.config).length > 0
                    ? state.user.config : userConfig;
                
                // Set dark theme
                if (state.user.subscription > Date.now() && state.user.config.darkTheme)
                    document.body.className = "theme-dark";
                
                // Build shortcuts object
                if (state.user.shortcuts) {
                    let shortcuts = {};
                    state.user.shortcuts.forEach(sc => {
                        shortcuts[sc.name] = sc.content;
                    });
                    state.user.shortcuts = shortcuts;
                }
                
                socket.emit("get filesystem", (data) => {
                    state.explorer = buildExplorerObject(data);
                    
                    this.state = state;
                    
                    // Push initial state to store
                    store.dispatch({
                        type: INITIALIZE_STATE, state
                    });
                    
                    // Generate an ad in 3 minutes and every 20 minutes after
                    if (Date.now() > state.user.subscription) {
                        let interval = setInterval(() => {
                            if (this.state.modal.action === "") {
                                clearInterval(interval);
                                generateAds(socket, store);
                                
                                setInterval(() => {
                                    generateAds(socket, store);
                                }, 20 * 60 * 1000);
                            }
                        }, 180 * 1000);
                    }
                    
                    // Set state based on current URL
                    setState(store, socket);
                    
                    // Update state according to url hash
                    window.onhashchange = () => setState(store, socket, true);
                });
            });
        };
        
        const q = parseQuery();

        // Attempt to login using XID/AUTH or skip to initialize()
        if (q.xid && q.auth) {
            socket.emit("login user", q.xid, q.auth, (err) => {
                if (err) {
                    location.href = XACC + "app/#/login/12";
                }
                else {
                    initialize();
                    location.hash = location.hash.split('?')[0];
                }
            });
        }
        else {
            initialize();
        }
    }

    render() {
        if (this.state == undefined) {
            return <span className="icon-loading" />;
        }
        
        return (
            <div>
                <Explorer 
                    data={this.state} 
                    socket={socket} 
                    dispatch={store.dispatch}
                />
                <Document
                    data={this.state}
                    socket={socket}
                    folders={this.state.explorer.folders}
                    dispatch={store.dispatch}
                />
                <Modal
                    data={this.state} 
                    socket={socket} 
                    dispatch={store.dispatch}
                />
                {screen.availHeight > screen.availWidth ? (
                    <div className="status-bar">{this.state.notification.status ? (
                        <Notification
                            data={this.state.notification}
                            dispatch={store.dispatch}
                        />
                    ) : (
                        <QuickLinks dispatch={store.dispatch} />
                    )}</div>
                ) : (
                    <div className="status-bar">
                        <QuickLinks dispatch={store.dispatch} />
                        <Notification
                            data={this.state.notification}
                            dispatch={store.dispatch}
                        />
                    </div>
                )}
            </div>
        );
    }

}

render(<App />, document.querySelector("#content"));