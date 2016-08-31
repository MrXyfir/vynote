import {
	LOAD_CONTRIBUTORS, ADD_CONTRIBUTOR, REMOVE_CONTRIBUTOR,
	SELECT_CONTRIBUTOR, SET_PERMISSIONS
} from "constants/action-types/modal/document-controls/contributors";

export function loadContributors(contributors) {
	return {
		type: LOAD_CONTRIBUTORS, contributors
	};
}

export function addContributor(email, uid) {
	return {
		type: ADD_CONTRIBUTOR, email, uid
	};
}

export function removeContributor(user) {
	return {
		type: REMOVE_CONTRIBUTOR, user
	};
}

export function selectContributor(user) {
	return {
		type: SELECT_CONTRIBUTOR, user
	};
}

export function setPermissions(data) {
	return {
		type: SET_PERMISSIONS, data
	};
}