import {
    TOGGLE_SHOW_UPGRADE_FORM
} from "constants/action-types/modal/user/account";

export default function (state, action) {
    switch (action.type) {
        case TOGGLE_SHOW_UPGRADE_FORM:
            return Object.assign({}, state, { showUpgradeForm: !state.showUpgradeForm });
        
        default:
            return state;
    }
}