// Reducers
import userInput from "./user-input";

// Action types
import { LOAD_FILESYSTEM, UPDATE_SCOPE } from "../../constants/action-types/explorer/";

// Lib modules
import getScopeParents from "../../lib/explorer/scope-parents";

export default function (state, action) {
	let actionType = action.type.split('/');
	
	if (actionType[0] == "EXPLORER") {
		if (actionType.length > 2) {
			switch (actionType[1]) {
				case "USER_INPUT":
					return userInput(state, action);
				default:
					return state;
			}	
		}
		// Action can be handled here
		else {
			switch (action.type) {
				case LOAD_FILESYSTEM:
					return action.explorer;
						
				case UPDATE_SCOPE:
					return Object.assign({}, state, {
						scope: action.scope, scopeParents: getScopeParents(state.folders, action.scope)
					});
					
				default:
					return state;
			}
		}
	}
	else {
		return state;
	}
}