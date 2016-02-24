// Reducers
import documentControls from "./document-controls";

// Action types
import { CLOSE } from "../../constants/action-types/modal/";

export default function (state, action) {
	let actionType = action.type.split("/");
	
	if (actionType[0] == "MODAL") {
		if (actionType.length > 2) {
			switch(actionType[2]) {
				case "DOCUMENT_CONTROLS":
					return documentControls(state, action);
					
				default:
					return state;
			}
		}
		else {
			switch(action.type) {
				case CLOSE:
					return { action: "" };
				
				default:
					return state;
			}
		}
	}
	else {
		return state;
	}
}