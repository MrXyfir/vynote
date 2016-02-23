import {
	LOAD_FILESYSTEM, UPDATE_SCOPE, DELETE_OBJECT, CREATE_FOLDER, CREATE_DOCUMENT
} from "../../constants/action-types/explorer/";

export function createFolder(data) {
	return {
		type: CREATE_FOLDER, data
	};
}

export function createDocument(data) {
	return {
		type: CREATE_DOCUMENT, data
	};
}

export function loadFileSystem(explorer) {
	return {
		type: LOAD_FILESYSTEM, explorer
	};
}

export function navigateToFolder(scope) {
	return {
		type: UPDATE_SCOPE, scope
	};
}

export function deleteObject(objType, id) {
	return {
		type: DELETE_OBJECT, objType, id
	};
}