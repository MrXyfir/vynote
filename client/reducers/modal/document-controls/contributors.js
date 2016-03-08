// Action types
import {
	LOAD_CONTRIBUTORS, REMOVE_CONTRIBUTOR, ADD_CONTRIBUTOR,
	SELECT_CONTRIBUTOR, SET_PERMISSIONS
} from "../../../constants/action-types/modal/document-controls/contributors";

export default function (state, action) {
	switch (action.type) {
		case LOAD_CONTRIBUTORS:
			return Object.assign({}, state, { contributors: action.contributors });
		
		case REMOVE_CONTRIBUTOR:
			return Object.assign({}, state, {
				contributors: state.contributors.filter(user => {
					return user.user_id != action.user;
				}), selectedContributor: 0
			});
		
		case ADD_CONTRIBUTOR:
			return Object.assign({}, state, {
				contributors: [{
                    user_id: action.uid, email: action.email,
                    permission: {
                        write: true, delete: true, update: true
                    }
				}].concat(state.contributors)
			});
		
		case SELECT_CONTRIBUTOR:
			return Object.assign({}, state, { selectedContributor: action.user });
			
		case SET_PERMISSIONS:
			let temp = JSON.parse(JSON.stringify(state));
			temp.contributors.forEach((user, i) => {
				if (user.user_id == action.data.user) {
					temp.contributors[i] = {
                        user_id: action.data.user, email: user.email,
                        permission: action.data.permissions
					};
				}
			});
			return temp;
			
		default:
			return state;
	}
}