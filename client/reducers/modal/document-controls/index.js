// Reducers
import contributors from "./contributors";
import templates from "./templates";
import versions from "./versions";

export default function (state, action) {
	let actionType = action.type.split('/');
	
    if (actionType[2] == "OPEN") {
        if (actionType[3] === undefined)
            return { action: "MODAL/DOCUMENT_CONTROLS/VERSIONS" };
        else
            return { action: "MODAL/DOCUMENT_CONTROLS/" + actionType[3] };
    }
    else {
        switch (actionType[2]) {
            case "VERSIONS":
                return versions(state, action);
            
            case "CONTRIBUTORS":
                return contributors(state, action);
                
            case "TEMPLATES":
                return templates(state, action);
                
            default:
                return state;
        }
    }
}