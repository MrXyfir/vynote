import {
    LOAD_TEMPLATE
} from "../../../constants/action-types/modal/document-controls/templates";

export function loadTemplate(id, variables, content) {
    return {
        type: LOAD_TEMPLATE, id, variables, content
    };
}