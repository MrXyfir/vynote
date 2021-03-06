// Reducers
import userInput from "./user-input";
import tabs from "./tabs";

// Action types
import {
	LOAD_FILESYSTEM, UPDATE_SCOPE, CREATE_FOLDER, CREATE_DOCUMENT,
    DELETE_OBJECT, RENAME_OBJECT, MOVE_OBJECT, SHOW_CONTROLS,
    DUPLICATE_DOCUMENT
} from "constants/action-types/explorer/index";

// Lib modules
import getScopeParents from "lib/explorer/scope-parents";

export default function (state, action) {
	let actionType = action.type.split('/');
	
	if (actionType[0] == "EXPLORER") {
		if (actionType.length > 2) {
			switch (actionType[1]) {
				case "USER_INPUT":
                    return userInput(state, action);
                    
                case "TABS":
                    return tabs(state, action);
                    
				default:
					return state;
			}	
		}
		// Action can be handled here
		else {
			let temp;
			
			switch (action.type) {
				case LOAD_FILESYSTEM:
					return action.explorer;
						
				case UPDATE_SCOPE:
					return Object.assign({}, state, {
						scope: action.scope, scopeParents: getScopeParents(state.folders, action.scope)
					});
					
				case CREATE_DOCUMENT:
					temp = JSON.parse(JSON.stringify(state));
					temp.documents[action.data.doc_id] = action.data;
					if (temp.children[action.data.folder_id] === undefined)
						temp.children[action.data.folder_id] = [{ type: 2, id: action.data.doc_id }];
					else
						temp.children[action.data.folder_id].push({ type: 2, id: action.data.doc_id });
					return temp;
					
				case CREATE_FOLDER:
					temp = JSON.parse(JSON.stringify(state));
					temp.folders[action.data.folder_id] = action.data;
					if (temp.children[action.data.parent_id] === undefined)
						temp.children[action.data.parent_id] = [{ type: 1, id: action.data.folder_id }];
					else
						temp.children[action.data.parent_id].push({ type: 1, id: action.data.folder_id });
					return temp;
					
				case DELETE_OBJECT:
					temp = JSON.parse(JSON.stringify(state));
					if (action.objType == 1) {
						delete temp.folders[action.id];
						// Delete all documents in folder
						Object.keys(temp.documents).forEach(doc => {
							if (temp.documents[doc].folder_id == action.id)
								delete temp.documents[doc];
						});
						delete temp.children[action.id];
					}
					else {
						delete temp.documents[action.id];
					}
					return temp;
					
				case RENAME_OBJECT:
					temp = JSON.parse(JSON.stringify(state));
					if (action.data.objType == 1)
						 temp.folders[action.data.id].name = action.data.name;
					else
						temp.documents[action.data.id].name = action.data.name;
					return temp;
					
                case MOVE_OBJECT:
                    temp = JSON.parse(JSON.stringify(state));
					if (action.data.objType == 1) {
						// Delete folder as child from previous parent
						temp.children[temp.folders[action.data.id].parent_id] =
							temp.children[temp.folders[action.data.id].parent_id].filter(child => {
								// Return all documents, return folders where id doesn't match
								return child.type == 2 || child.id != action.data.id;
							});
						// Add folder as child to new parent
                        if (temp.children[action.data.to] === undefined) {
                            temp.children[action.data.to] = [{ type: 1, id: action.data.id }];
                        }
                        else {
                            temp.children[action.data.to].push(
                                { type: 1, id: action.data.id }
                            );
                        }
                        
						// Update folder's parent_id
						temp.folders[action.data.id].parent_id = action.data.to;
					}
					else {
						// Delete doc as child from previous parent
						temp.children[temp.documents[action.data.id].folder_id] =
							temp.children[temp.documents[action.data.id].folder_id].filter(child => {
								// Return all folders, return doc where id doesn't match
								return child.type == 1 || child.id != action.data.id;
							});
						
                        if (temp.children[action.data.to] === undefined) {
                            temp.children[action.data.to] = [{ type: 2, id: action.data.id }];
                        }
                        else {
                            // Add doc as child to new parent
                            temp.children[action.data.to].push(
                                { type: 2, id: action.data.id }
                            );
                        }
						
                        // Update doc's parent_id
						temp.documents[action.data.id].parent_id = action.data.to;
					}
                    return temp;
                    
                case SHOW_CONTROLS:
                    return Object.assign({}, state, { controls: {
                        objType: action.objType, id: action.id
                    } });
                    
                case DUPLICATE_DOCUMENT:
                    return (() => {
                        let temp = Object.assign({}, state);
                        
						// Copy origin file, update id, append " - Copy" to name
                        temp.documents[action.newId] = Object.assign(
							{}, temp.documents[action.id]
						);
                        temp.documents[action.newId].doc_id = action.newId;
                        temp.documents[action.newId].name += " - Copy";
                        
						// Add new document to parent's children
                        temp.children[temp.documents[action.id].folder_id].push(
                            { type: 2, id: action.newId }
                        );
                        
                        return temp;
                    }).call();
					
				default:
					return state;
			}
		}
	}
	else {
		return state;
	}
}