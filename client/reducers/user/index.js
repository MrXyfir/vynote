// Action types
import {
    SET_SUBSCRIPTION
} from "../../constants/action-types/user/";

export default function (state, action) {

    switch (action.type) {
        case SET_SUBSCRIPTION:
            return Object.assign({}, state, { subscription: action.time});
        
        default:
            return state;
    }
    
}