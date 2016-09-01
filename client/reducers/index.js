// Reducers
import user from "./user/index";
import modal from "./modal/index";
import document from "./document/index";
import explorer from "./explorer/index";
import notification from "./notification";

import { INITIALIZE_STATE } from "constants/action-types/index";

export default function (state, action) {

    if (action.type == INITIALIZE_STATE)
        return action.state;
    else if (state == undefined)
        return {};

    return {
        user: user(state.user, action),
        modal: modal(state.modal, action),
        document: document(state.document, action),
        explorer: explorer(state.explorer, action),
        notification: notification(state.notification, action)
    };

}