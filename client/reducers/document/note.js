// Action types
import {
    TOGGLE_SHOW_CHILDREN, SHOW_ELEMENT_CONTROLS, SET_ELEMENT_FLAGS,
    INITIALIZE_RENDER, CHANGE_SCOPE, SET_SEARCH_QUERY, SET_FLAGS,
    TOGGLE_SHOW_FLAG_FILTER, UPDATE_ELEMENT_CONTENT,
    EDIT_ELEMENT, DELETE_ELEMENT, ADD_ELEMENT
} from "../../constants/action-types/documents/note";

// Modules
import scopeParents from "../../lib/note/scopeParents";

// Other constants
import flags from "../../constants/flags";

export default function (state, action) {
    switch (action.type) {
        case INITIALIZE_RENDER:
            return Object.assign({}, state, {
                render: {
                    scope: "home",
                    scopeParents: [],
                    filter: {
                        flags: flags.slice(1),
                        search: ""
                    },
                    showChildren: [],
                    editing: "", hovering: "", controls: "",
                    showFlagFilter: false
                }
            });
            
        case CHANGE_SCOPE:
            return Object.assign({}, state, {
                render: {
                    scope: action.id, scopeParents: scopeParents(state.content, action.id),
                    showChildren: [], editing: "", hovering: "", controls: "",
                    filter: state.render.filter, showFlagFilter: false
                }
            });
            
        case SET_SEARCH_QUERY:
            return Object.assign({}, state, {
                render: Object.assign({}, state.render, {
                    filter: {
                        search: action.query, flags: state.render.filter.flags
                    }
                })
            });
            
        case SET_FLAGS:
            return Object.assign({}, state, {
                render: Object.assign({}, state.render, {
                    filter: {
                        flags: action.flags, search: state.render.filter.search
                    }
                })
            });
            
        case TOGGLE_SHOW_FLAG_FILTER:
            return Object.assign({}, state, {
                render: Object.assign({}, state.render, {
                    showFlagFilter: !state.render.showFlagFilter
                })
            });
            
        case ADD_ELEMENT:
            return Object.assign({}, state, {
                content: Object.assign({}, state.content, {
                    [action.id]: {
                        parent: action.parent, content: "", flags: [], children: []
                    },
                    [action.parent]: Object.assign({}, state.content[action.parent], {
                        children: state.content[action.parent].concat(action.id)
                    })
                })
            });
            
        case EDIT_ELEMENT:
            return Object.assign({}, state, {
                render: Object.assign({}, state.render, {
                    editing: action.id
                })
            });
            
        case UPDATE_ELEMENT_CONTENT:
            return Object.assign({}, state, {
                content: Object.assign({}, state.content, {
                    [action.id]: Object.assign({}, state.content[action.id], {
                        content: action.content
                    })
                })
            });
            
        case DELETE_ELEMENT:
            return (() => {
                let temp = Object.assign({}, state);
                
                delete temp.content[action.id];

                temp.content[temp.content[action.id].parent].children.splice(
                    temp.content[temp.content[action.id].parent].children.indexOf(action.id), 1
                );
                
                return temp;
            }).call();
            
        case SHOW_ELEMENT_CONTROLS:
            return Object.assign({}, state, {
                render: Object.assign({}, state.render, {
                    controls: action.id
                })
            });
            
        case SET_ELEMENT_FLAGS:
            return Object.assign({}, state, {
                content: Object.assign({}, state.content, {
                    [action.id]: Object.assign({}, state.content[action.id], {
                        flags: action.flags
                    })
                })
            });
        
        case TOGGLE_SHOW_CHILDREN:
            return Object.assign({}, state, {
                render: Object.assign({}, state.render, {
                    showChildren: (
                        state.render.showChildren.indexOf(action.id) > -1
                        ? state.render.showChildren.filter(id => { return id != action.id; })
                        : state.render.showChildren.concat(action.id)
                    )
                })
            });
        
        default:
            return state;
    }
}