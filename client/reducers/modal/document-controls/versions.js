// Action types
import {
	LOAD_VERSIONS, DELETE_VERSION, CREATE_VERSION
} from "constants/action-types/modal/document-controls/versions";

export default function (state, action) {
	switch (action.type) {
		case LOAD_VERSIONS:
			return Object.assign({}, state, { versions: action.versions });
		
		case DELETE_VERSION:
			return Object.assign({}, state, {
				versions: state.versions.filter(version => {
					return version.name != action.name;
				})
			});
		
		case CREATE_VERSION:
			return Object.assign({}, state, {
				versions: [{ name: action.name, created: (
					new Date().toISOString().slice(0, 19).replace('T', ' ')
				)}].concat(state.versions)
			});
			
		default:
			return state;
	}
}