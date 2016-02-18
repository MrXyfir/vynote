// Document reducers
import note from "./note";
import page from "./page";
import code from "./code";

export default function (state, action) {
	let actionType = action.type.split('/');
	
	// Call appropriate reducers if action affects a document's state
	if (actionType[0] == "DOCUMENT") {
		switch (actionType[1]) {
			case "NOTE":
				return note(state, action);
			case "PAGE":
				return page(state, action);
			case "CODE":
				return code(state, action);
			default:
				return state;
		}	
	}
	else {
		return state;
	}
}