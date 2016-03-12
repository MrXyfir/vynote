import {
    INITIALIZE_RENDER, CHANGE_SCOPE
} from "../../constants/action-types/documents/note";

export function initializeRenderObject() {
    return {
        type: INITIALIZE_RENDER
    };
}

export function navigateToElement(id) {
    return {
        type: CHANGE_SCOPE, id
    };
}