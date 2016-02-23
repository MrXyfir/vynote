import { 
	CREATE_FOLDER, CREATE_DOCUMENT, CLOSE, RENAME_OBJECT, MOVE_OBJECT
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

export function triggerRenameObject(objType, objId) {
	return {
		type: RENAME_OBJECT, objType, objId
	}
}

export function triggerMoveObject(objType, objId) {
	return {
		type: MOVE_OBJECT, objType, objId
	}
}