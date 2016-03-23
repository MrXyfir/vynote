import {
    CREATE_TAB, CLOSE_ALL, SELECT_TAB, CLOSE_TAB, CHANGE_DOCUMENT,
    HOVER_TAB, SAVE_DOCUMENT, MARK_FOR_RELOAD
} from "../../constants/action-types/explorer/tabs";

export function createTab() {
    return {
        type: CREATE_TAB
    };
}

export function closeAll() {
    return {
        type: CLOSE_ALL
    };
}

export function selectTab(id) {
    return {
        type: SELECT_TAB, id
    };
}

export function closeTab(id) {
    return {
        type: CLOSE_TAB, id
    };
}

export function hoverTab(id) {
    return {
        type: HOVER_TAB, id
    };
}

export function saveDocument(id, document) {
    return {
        type: SAVE_DOCUMENT, id, document
    };
}

export function markForReload(id) {
    return {
        type: MARK_FOR_RELOAD, id
    };
}

export function changeDocument(oldId, newId, name, directory) {
    return {
        type: CHANGE_DOCUMENT, oldId, newId, name, directory
    };
}