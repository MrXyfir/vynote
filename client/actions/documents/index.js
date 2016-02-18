import { ERROR, SUCCESS } from "../../constants/action-types/notifications";
import { SAVE_CONTENT } from "../../constants/action-types/documents/";

export function saveError() {
	return {
		type: ERROR, messge: "There was an error while trying to save your document"
	};
}

export function saveSuccess() {
	return {
		type: SUCCESS, message: "Your document was saved successfully"	
	};
}

export function saveContent(data) {
	return {
		type: SAVE_CONTENT, data
	};
}