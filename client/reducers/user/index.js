// Action types
import {
    SET_SUBSCRIPTION, SET_CONFIG, CREATE_SHORTCUT, DELETE_SHORTCUT
} from "../../constants/action-types/user/";

export default function (state, action) {

    switch (action.type) {
        case SET_SUBSCRIPTION:
            return Object.assign({}, state, { subscription: action.time });
            
        case SET_CONFIG:
            return Object.assign({}, state, { config: action.config });
            
        case CREATE_SHORTCUT:
            return Object.assign({}, state, {
                shortcuts: Object.assign({}, state.shortcuts, {
                    [action.name]: action.message
                })
            });
            
        case DELETE_SHORTCUT:
            return (() => {
                let temp = Object.assign({}, state);
                delete temp.shortcuts[action.name];
                return temp;
            }).call();
        
        default:
            return state;
    }
    
}