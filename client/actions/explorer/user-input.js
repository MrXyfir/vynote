import { 
	CREATE_FOLDER, CREATE_DOCUMENT, CLOSE
} from "../../constants/action-types/explorer/user-input";

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

export function closeUserInput() {
	return {
		type: CLOSE
	};
}