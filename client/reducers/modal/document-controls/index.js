// Reducers
import contributors from "./contributors";
import versions from "./versions";

export default function (state, action) {
	let actionType = action.type.split('/');
	
	switch (actionType[2]) {
        case "OPEN":
            return { action: "MODAL/DOCUMENT_CONTROLS/VERSIONS" }
        
		case "VERSIONS":
			return versions(state, action);
		
		case "CONTRIBUTORS":
			return contributors(state, action);
			
		default:
			return state;
	}
}