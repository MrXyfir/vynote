import {
    SUCCESS, ERROR, INFO, CLEAR, ADVERT
} from "../constants/action-types/notifications";

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

export function clear() {
	return {
		type: CLEAR
	};
}

export function loadNotificationAd(ad) {
    return {
        type: ADVERT, ad
    };
}