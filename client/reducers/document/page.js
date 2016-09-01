import { TOGGLE_PREVIEW } from "constants/action-types/documents/page";

export default function (state, action) {
	switch (action.type) {
		case TOGGLE_PREVIEW:
			return Object.assign({}, state, { preview: !state.preview });
		default:
			return state;
	}
}