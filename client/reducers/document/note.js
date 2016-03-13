// Action types
import {
    INITIALIZE_RENDER, CHANGE_SCOPE, SET_SEARCH_QUERY,
    SET_FLAGS, TOGGLE_SHOW_FLAG_FILTER, ADD_ELEMENT
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
        
        default:
            return state;
    }
}