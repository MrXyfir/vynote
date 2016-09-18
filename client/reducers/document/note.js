// Action types
import {
    TOGGLE_SHOW_FLAG_FILTER, UPDATE_ELEMENT_CONTENT, ELEMENT_CREATED, TOGGLE_SHOW_CHILDREN,
    SET_ELEMENT_FLAGS, INITIALIZE_RENDER, CHANGE_SCOPE, SET_SEARCH_QUERY,
    SET_FLAGS, EDIT_ELEMENT, DELETE_ELEMENT, ADD_ELEMENT, MOVE_ELEMENT
} from "constants/action-types/documents/note";

// Modules
import scopeParents from "lib/note/scope-parents";

export default function (state, action) {
    switch (action.type) {
        case INITIALIZE_RENDER:
            return Object.assign({}, state, {
                render: {
                    scope: "home",
                    scopeParents: [],
                    filter: {
                        flags: [0], search: ""
                    },
                    showChildren: [],
                    showFlagFilter: false,
                    editing: ""
                }
            });
            
        case CHANGE_SCOPE:
            return Object.assign({}, state, {
                render: {
                    scope: action.id, scopeParents: scopeParents(state.content, action.id),
                    showChildren: [], editing: "", filter: state.render.filter,
                    showFlagFilter: false
                }
            });
            
        case SET_SEARCH_QUERY:
            return Object.assign({}, state, {
                render: Object.assign({}, state.render, {
                    filter: {
                        search: action.query, flags: state.render.filter.flags
                    }
                })
            });
            
        case SET_FLAGS:
            return Object.assign({}, state, {
                render: Object.assign({}, state.render, {
                    filter: {
                        flags: action.flags, search: state.render.filter.search
                    }
                })
            });
            
        case TOGGLE_SHOW_FLAG_FILTER:
            return Object.assign({}, state, {
                render: Object.assign({}, state.render, {
                    showFlagFilter: !state.render.showFlagFilter
                })
            });
            
        case ADD_ELEMENT:
            return Object.assign({}, state, {
                content: Object.assign({}, state.content, {
                    [action.id]: {
                        parent: action.parent, content: "", flags: [], children: [],
                        create: true
                    },
                    [action.parent]: Object.assign({}, state.content[action.parent], {
                        children: (
                            (action.index > -1)
                            ? (
                                state.content[action.parent].children.slice(0, action.index)
                                .concat([action.id])
                                .concat(state.content[action.parent].children.slice(action.index))
                            )
                            : (
                                state.content[action.parent].children.concat(action.id)
                            )
                        )
                    })
                })
            });
            
        case EDIT_ELEMENT:
            return Object.assign({}, state, {
                render: Object.assign({}, state.render, {
                    editing: action.id
                })
            });
            
        case UPDATE_ELEMENT_CONTENT:
            return Object.assign({}, state, {
                content: Object.assign({}, state.content, {
                    [action.id]: Object.assign({}, state.content[action.id], {
                        content: action.content
                    })
                })
            });
            
        case DELETE_ELEMENT:
            return (() => {
                let parent = state.content[action.id].parent;
                let temp = Object.assign({}, state);

                // Remove element from children of parent
                temp.content[parent].children = temp.content[parent].children.filter(child => {
                    return child != action.id;
                });

                let children = [];

                // Populate children[] with ids of all children elements
                const getChildren = (id) => {
                    let c = [];

                    temp.content[id].children.forEach(child => {
                        c.push(child);
                        c.concat(getChildren(child));
                    });

                    return c;
                };
                children = getChildren(action.id);

                // Delete child elements in children[]
                children.forEach(child => {
                    delete temp.content[child];
                });

                // Delete element
                delete temp.content[action.id];
                
                return temp;
            }).call();
            
        case SET_ELEMENT_FLAGS:
            return Object.assign({}, state, {
                content: Object.assign({}, state.content, {
                    [action.id]: Object.assign({}, state.content[action.id], {
                        flags: action.flags
                    })
                })
            });
        
        case TOGGLE_SHOW_CHILDREN:
            return Object.assign({}, state, {
                render: Object.assign({}, state.render, {
                    showChildren: (
                        state.render.showChildren.indexOf(action.id) > -1
                        ? state.render.showChildren.filter(id => { return id != action.id; })
                        : state.render.showChildren.concat(action.id)
                    )
                })
            });
            
        case ELEMENT_CREATED:
            return (() => {
                let temp = Object.assign({}, state);
                delete temp.content[action.id].create;
                return temp;
            }).call();
            
        case MOVE_ELEMENT:
            return (() => {
                let temp = Object.assign({}, state);
                
                let oldParent = temp.content[action.id].parent;
                
                // Remove element from oldParent.children[]
                temp.content[oldParent].children = temp.content[oldParent].children.filter(child => {
                    return child != action.id;
                });
                
                // Add element to its parent.children[] at appropriate location
                if (action.index > -1)
                    temp.content[action.parent].children.splice(action.index, 0, action.id);
                else
                    temp.content[action.parent].children.push(action.id);
                    
                // Update element's parent
                temp.content[action.id].parent = action.parent;
                
                return temp;
            }).call();
        
        default:
            return state;
    }
}