import { CREATE_FOLDER, CREATE_DOCUMENT } from "../../constants/action-types/explorer/user-input";
import { ERROR } from "../../constants/action-types/notifications";

export function triggerCreateFolder() {
	return {
		type: CREATE_FOLDER
	};
}

export function triggerCreateDocument() {
	return {
		type: CREATE_DOCUMENT
	};
}