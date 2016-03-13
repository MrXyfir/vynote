// Action types
import {
    INITIALIZE_RENDER, CHANGE_SCOPE
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
        
        default:
            return state;
    }
}