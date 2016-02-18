// Reducers
import document from "./document/";
import notification from "./notification";

import initialState from "../constants/initial-state";

export default function (state = initialState, action) {

    return {
        document: document(state.document, action),
        notification: notification(state.notifcation, action)
    };

}