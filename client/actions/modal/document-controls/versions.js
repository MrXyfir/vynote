import {
	LOAD_VERSIONS, DELETE_VERSION, CREATE_VERSION
} from "constants/action-types/modal/document-controls/versions";

export function loadVersions(versions) {
	return {
		type: LOAD_VERSIONS, versions
	};
}

export function deleteVersion(name) {
	return {
		type: DELETE_VERSION, name
	};
}

export function createVersion(name) {
	return {
		type: CREATE_VERSION, name
	};
}