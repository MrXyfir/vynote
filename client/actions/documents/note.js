import {
    INITIALIZE_RENDER, CHANGE_SCOPE, SET_SEARCH_QUERY,
    SET_FLAGS, TOGGLE_SHOW_FLAG_FILTER, ADD_ELEMENT
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