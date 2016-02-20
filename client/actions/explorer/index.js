import { LOAD_FILESYSTEM, UPDATE_SCOPE } from "../../constants/action-types/explorer/";

export function createFolder(data) {
	return {
		
	};
}

export function createDocument(data) {
	return {
		
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