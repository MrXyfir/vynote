export default function (temp, scope = 0) {
	let explorer = {
        folders: {
            0: { name: "Home" }
        },
        children: {
            0: []
        },
		documents: {},
		scopeParents: [],
        userInput: { action: "" },
        hover: {
            objType: 0, id: 0
        },
		scope
	};
	
	temp.folders.forEach(folder => {
        // Add folder's parent and name to explorer.folders object by ID
        explorer.folders[folder.folder_id] = folder;
		
		// Add folder as child for folder.parent_id
        if (explorer.children[folder.parent_id] === undefined)
            explorer.children[folder.parent_id] = [{ type: 1, id: folder.folder_id }];
        else
            explorer.children[folder.parent_id].push({ type: 1, id: folder.folder_id });
    });
	
	temp.documents.forEach(doc => {
		// Add document's info to explorer.documents object by ID
        explorer.documents[doc.doc_id] = doc;
		
		// Add folder as child for doc.folder_id
        if (explorer.children[doc.folder_id] === undefined)
            explorer.children[doc.folder_id] = [{ type: 2, id: doc.doc_id }];
        else
            explorer.children[doc.folder_id].push({ type: 2, id: doc.doc_id });
	});
	
	temp = null; 
	
	return explorer;
}