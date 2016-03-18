import settings from "./settings";
import account from "./account";

export default function (state, action) {
	let actionType = action.type.split('/');
	
    if (actionType[2] == "OPEN") {
        return { action: "MODAL/USER/" + actionType[3] };
    }
    else {
        switch (actionType[2]) {
            case "ACCOUNT":
                return account(state, action);
                
            case "SETTINGS":
                return settings(state, action);
            
            default:
                return state;
        }
    }
}