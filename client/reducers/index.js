// Reducers
import user from "./user/index";
import modal from "./modal/index";
import document from "./document/index";
import explorer from "./explorer/index";
import notification from "./notification";

import { INITIALIZE_STATE, SET_VIEW } from "constants/action-types/index";

export default function (state, action) {

    if (state === undefined) {
        return {};
    }
    else {
        switch (action.type) {
            case INITIALIZE_STATE:
                return action.state;
            
            case SET_VIEW:
                return Object.assign({}, state, { view: action.view });

            default:
                return {
                    view: state.view,
                    user: user(state.user, action),
                    modal: modal(state.modal, action),
                    document: document(state.document, action),
                    explorer: explorer(state.explorer, action),
                    notification: notification(state.notification, action)
                };
        }
    }

}