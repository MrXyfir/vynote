export default function (notes, scope) {
    
    const getParent = (id) => {
        // Previous element's parent is home element
        if (id == "home") {
            return ["home"];
        }
        // Return current id and parent's id
        else {
			return [id].concat(getParent(notes[id].parent));
		}
	};
	
    // If the CURRENT scope is home, there are no parents
	if (scope == "home") {
        return [];
	}
    // Build array of parent element IDs
    else {
		let scopeParents = getParent(notes[scope].parent);
		
		// getParent array starts with current scope and ends with root
		// reverse so scopeParents starts with root down to scope
        scopeParents.reverse(); 
		
		return scopeParents; 
	}
    
}