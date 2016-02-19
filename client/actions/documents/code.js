import { SET_SYNTAX, SET_THEME } from "../../constants/action-types/documents/code";

export function setSyntax(syntax) {
	return {
		type: SET_SYNTAX, syntax
	}
}

export function setTheme(theme) {
	return {
		type: SET_THEME, theme
	}
}