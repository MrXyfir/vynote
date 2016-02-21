import { SUCCESS, ERROR, INFO } from "../constants/action-types/notifications";

export function error(message) {
	return {
		type: ERROR, message
	};
};

export function success(message) {
	return {
		type: SUCCESS, message
	};
};

export function info(message) {
	return {
		type: INFO, message
	};
};