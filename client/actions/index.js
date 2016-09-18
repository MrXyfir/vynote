import { SET_VIEW } from "constants/action-types/index";

export function setView(view) {
	return {
		type: SET_VIEW, view
	};
};