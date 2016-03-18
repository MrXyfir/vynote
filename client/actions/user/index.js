import { SET_SUBSCRIPTION } from "../../constants/action-types/user/";

export function setSubscription(time) {
    return {
        type: SET_SUBSCRIPTION, time
    };
}