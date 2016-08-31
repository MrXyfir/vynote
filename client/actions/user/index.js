import {
    SET_SUBSCRIPTION, SET_CONFIG, CREATE_SHORTCUT, DELETE_SHORTCUT
} from "constants/action-types/user/index";

export function setSubscription(time) {
    return {
        type: SET_SUBSCRIPTION, time
    };
}

export function setConfig(config) {
    return {
        type: SET_CONFIG, config
    };
}

export function createShortcut(name, message) {
    return {
        type: CREATE_SHORTCUT, name, message
    };
}

export function deleteShortcut(name) {
    return {
        type: DELETE_SHORTCUT, name
    };
}