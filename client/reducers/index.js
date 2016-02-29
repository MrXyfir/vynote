// Reducers
import modal from "./modal/";
import document from "./document/";
import explorer from "./explorer/";
import notification from "./notification";

import { INITIALIZE_STATE } from "../constants/action-types/";

export default function (state, action) {

    if (action.type == INITIALIZE_STATE)
        return action.state;
    else if (state == undefined)
        return {};

    return {
        modal: modal(state.modal, action),
        document: document(state.document, action),
        explorer: explorer(state.explorer, action),
        notification: notification(state.notifcation, action)
    };

}