import {
    TOGGLE_SHOW_FLAG_FILTER, UPDATE_ELEMENT_CONTENT, ELEMENT_CREATED,
    TOGGLE_SHOW_CHILDREN, SHOW_ELEMENT_CONTROLS, SET_ELEMENT_FLAGS,
    INITIALIZE_RENDER, CHANGE_SCOPE, SET_SEARCH_QUERY, SET_FLAGS,
    EDIT_ELEMENT, DELETE_ELEMENT, ADD_ELEMENT, HOVER_ELEMENT,
    MOVE_ELEMENT
} from "constants/action-types/documents/note";

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

export function setSearchQuery(query) {
    return {
        type: SET_SEARCH_QUERY, query
    };
}

export function setFlags(flags) {
    return {
        type: SET_FLAGS, flags
    };
}

export function toggleShowFlagFilter() {
    return {
        type: TOGGLE_SHOW_FLAG_FILTER
    };
}

export function addElement(parent, id, index = -1) {
    return {
        type: ADD_ELEMENT, parent, id, index
    };
}

export function editElement(id) {
    return {
        type: EDIT_ELEMENT, id
    };
}

export function updateElementContent(id, content) {
    return {
        type: UPDATE_ELEMENT_CONTENT, id, content
    };
}

export function deleteElement(id) {
    return {
        type: DELETE_ELEMENT, id
    };
}

export function toggleShowChildren(id) {
    return {
        type: TOGGLE_SHOW_CHILDREN, id
    };
}

export function showElementControls(id) {
    return {
        type: SHOW_ELEMENT_CONTROLS, id
    };
}

export function setElementFlags(id, flags) {
    return {
        type: SET_ELEMENT_FLAGS, id, flags
    };
}

export function elementCreated(id) {
    return {
        type: ELEMENT_CREATED, id
    };
}

export function hoverElement(id) {
    return {
        type: HOVER_ELEMENT, id
    };
}

export function moveElement(id, parent, index = -1) {
    return {
        type: MOVE_ELEMENT, id, parent, index
    }
}