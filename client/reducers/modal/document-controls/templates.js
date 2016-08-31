import {
    LOAD_TEMPLATE
} from "constants/action-types/modal/document-controls/templates";

export default function (state, action) {
	switch (action.type) {
		case LOAD_TEMPLATE:
            return Object.assign({}, state, {
                template: action.id, variables: action.variables, content: action.content
            });
			
		default:
			return state;
	}
}