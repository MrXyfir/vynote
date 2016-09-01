import { CLOSE, LOAD_AD } from "constants/action-types/modal/index";

export function close() {
	return {
		type: CLOSE
	};
};

export function loadModalAd(ad) {
    return {
        type: LOAD_AD, ad
    };
}