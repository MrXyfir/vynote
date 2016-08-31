import {
	LOAD_FILESYSTEM, UPDATE_SCOPE, DELETE_OBJECT, CREATE_FOLDER, CREATE_DOCUMENT,
	RENAME_OBJECT, MOVE_OBJECT, SHOW_CONTROLS, DUPLICATE_DOCUMENT
} from "constants/action-types/explorer/index";

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

export function renameObject(data) {
	return {
		type: RENAME_OBJECT, data
	};
}

export function moveObject(data) {
	return {
		type: MOVE_OBJECT, data
	};
}

export function showControls(objType, id) {
    return {
        type: SHOW_CONTROLS, objType, id
    };
}

export function duplicateDocument(id, newId) {
    return {
        type: DUPLICATE_DOCUMENT, id, newId
    };
}