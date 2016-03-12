import {
    INITIALIZE_RENDER
} from "../../constants/action-types/documents/note";

export default function (state, action) {
    switch (action.type) {
        case INITIALIZE_RENDER:
            return Object.assign({}, state, {
                render: {
                    scope: "home",
                    scopeParents: [],
                    filter: {
                        flags: [], search: ""
                    },
                    showChildren: [],
                    editing: "", hovering: "", controls: ""
                }
            });
        
        default:
            return state;
    }
}