import {
    CREATE_TAB, CLOSE_ALL, SELECT_TAB, CLOSE_TAB, CHANGE_DOCUMENT,
    HOVER_TAB, SAVE_DOCUMENT, MARK_FOR_RELOAD
} from "../../constants/action-types/explorer/tabs";

export default function (state, action) {
	switch (action.type) {
        case CREATE_TAB:
            return Object.assign({}, state, {
                tabs: Object.assign({}, state.tabs, {
                    list: Object.assign({}, state.tabs.list, {
                        ['0']: { name: "New Tab", directory: "" }
                    })
                })
            });
            
        case CLOSE_ALL:
            return Object.assign({}, state, {
                tabs: {
                    active: -1, hover: -1, list: {}
                }
            });
            
        case SELECT_TAB:
            return Object.assign({}, state, {
                tabs: Object.assign({}, state.tabs, {
                    active: action.id
                })
            });
            
        case CLOSE_TAB:
            return (() => {
                let temp = Object.assign({}, state);
                delete temp.tabs.list[action.id];
                return temp;
            }).call();
            
        case HOVER_TAB:
            return Object.assign({}, state, {
                tabs: Object.assign({}, state.tabs, {
                    hover: action.id
                })
            });
            
        case SAVE_DOCUMENT:
            return (() => {
                if (state.tabs.list[action.id] == undefined) return state;
                
                return Object.assign({}, state, {
                    tabs: Object.assign({}, state.tabs, {
                        list: Object.assign({}, state.tabs.list, {
                            [action.id]: Object.assign({}, state.tabs.list[action.id], {
                                document: action.document
                            })
                        })
                    })
                })
            }).call();
            
        case MARK_FOR_RELOAD:
            return Object.assign({}, state, {
                tabs: Object.assign({}, state.tabs, {
                    list: Object.assign({}, state.tabs.list, {
                        [action.id]: Object.assign({}, state.tabs.list[action.id], {
                            reload: true
                        })
                    })
                })
            });
        
        case CHANGE_DOCUMENT:
            return (() => {
                let temp = Object.assign({}, state), list = {};
                
                // Replace oldId with newId while keeping order of tabs
                Object.keys(temp.tabs.list).forEach(tab => {
                    if (tab == action.oldId) {
                        list[action.newId] = {
                            name: action.name, directory: action.directory
                        };
                    }
                    else {
                        list[tab] = temp.tabs.list[tab];
                    }
                });
                
                temp.tabs.list = list;
                return temp;
            }).call();
			
		default:
			return state;
	}
}