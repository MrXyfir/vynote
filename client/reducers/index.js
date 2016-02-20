// Reducers
import document from "./document/";
import explorer from "./explorer";
import notification from "./notification";

import initialState from "../constants/initial-state";

export default function (state = initialState, action) {

    return {
        document: document(state.document, action),
        explorer: explorer(state.explorer, action),
        notification: notification(state.notifcation, action)
    };

}