// Reducers
import documentControls from "./document-controls/index";
import user from "./user/index";

// Action types
import { CLOSE, LOAD_AD } from "constants/action-types/modal/index";

export default function (state, action) {
	let actionType = action.type.split("/");
	
	if (actionType[0] == "MODAL") {
		if (actionType.length > 2) {
			switch(actionType[1]) {
				case "DOCUMENT_CONTROLS":
                    return documentControls(state, action);
                
                case "USER":
                    return user(state, action);
					
				default:
					return state;
			}
		}
		else {
			switch(action.type) {
				case CLOSE:
                    return { action: "" };
                    
                case LOAD_AD:
                    return { action: "MODAL/ADVERTISEMENT", ad: action.ad };
				
				default:
					return state;
			}
		}
	}
	else {
		return state;
	}
}