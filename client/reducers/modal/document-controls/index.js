// Reducers
import contributors from "./contributors";
import versions from "./versions";

export default function (state, action) {
	let actionType = action.type.split('/');
	
	switch (actionType[2]) {
		case "VERSIONS":
			return versions(state, action);
		
		case "CONTRIBUTORS":
			return contributors(state, action);
			
		default:
			return state;
	}
}