import {
    INITIALIZE_RENDER, CHANGE_SCOPE, SET_SEARCH_QUERY, SET_FLAGS,
    TOGGLE_SHOW_FLAG_FILTER, UPDATE_ELEMENT_CONTENT,
    EDIT_ELEMENT, DELETE_ELEMENT, ADD_ELEMENT
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

export function addElement(parent, id) {
    return {
        type: ADD_ELEMENT, parent, id
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