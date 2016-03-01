export default function (folders, scope) {
	const getParent = (id) => {
		if (folders[id].parent_id == 0) {
			return [{ name: folders[id].name, id }].concat(
				[{ name: "", id: 0 }]
			);
		}
		else {
			return [{ name: folders[id].name, id }].concat(
				getParent(folders[id].parent_id)
			);
		}
	};
	
	if (scope == 0) {
        return [{ name: "", id: 0 }];
	}
    else {
		let scopeParents = getParent(folders[scope].parent_id);
		
		// getParent array starts with current scope and ends with root
		// reverse so scopeParents starts with root down to scope
		scopeParents.reverse(); 
		
		return scopeParents; 
	}
}