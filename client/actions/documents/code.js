import {
    SET_SYNTAX, SET_THEME, TOGGLE_EDITOR_SETTINGS
} from "../../constants/action-types/documents/code";

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

export function toggleShowEditorSettings() {
    return {
        type: TOGGLE_EDITOR_SETTINGS
    };
}