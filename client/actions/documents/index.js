import { ERROR, SUCCESS } from "../../constants/action-types/notifications";
import {
	SAVE_CONTENT, LOAD_CONTENT, SET_KEY, LOAD_DOCUMENT
} from "../../constants/action-types/documents/";

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

export function accessError() {
	return {
		type: ERROR, message: "Could not access document with provided encryption key"	
	};
}

export function loadDocument(document) {
	return {
		type: LOAD_DOCUMENT, document	
	};
}

export function loadContent(content) {
	return {
		type: LOAD_CONTENT, content
	};
}

export function setEncryptionKey(key) {
	return {
		type: SET_KEY, key
	};
}