import { CREATE_FOLDER, CREATE_DOCUMENT } from "../../constants/action-types/explorer/user-input";
import { RENAME_OBJECT, MOVE_OBJECT } from "../../constants/action-types/explorer/user-input";

export default function (state, action) {
	switch (action.type) {
		case CREATE_FOLDER:
			return Object.assign({}, state, { userInput: { action: CREATE_FOLDER }});
			
		case CREATE_DOCUMENT:
			return Object.assign({}, state, { userInput: { action: CREATE_DOCUMENT }});
			
		case RENAME_OBJECT:
			return Object.assign({}, state, {
				userInput: {
					action: RENAME_OBJECT, objType: action.objType, objId: action.objId
				}
			});
			
		case MOVE_OBJECT:
			return Object.assign({}, state, {
				action: MOVE_OBJECT, objType: action.objType, objId: action.objId
			});
			
		default:
			return state;
	}
}