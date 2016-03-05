import { SET_SYNTAX, SET_THEME } from "../../constants/action-types/documents/code";

export default function (state, action) {
	switch (action.type) {
		case SET_SYNTAX:
            return Object.assign({}, state, { syntax: action.syntax });
            
		case SET_THEME:
            return Object.assign({}, state, { theme: action.theme });
            
		default:
			return state;
	}
}