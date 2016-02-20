export default function (temp, scope) {
	let explorer = {
		folders: {},
		children: {},
		documents: {},
		scope 
	};
	
	temp.folders.forEach(folder => {
        // Add folder's parent and name to explorer.folders object by ID
        explorer.folders[folder.folder_id] = {
            parent: folder.parent_id, name: folder.name
        };

        // Add folder as child in explorer.children.parent_id
        if (explorer.children[folder.parent_id] === undefined)
            explorer.children[folder.parent_id] = [{type: 1, id: folder.folder_id}];
        else
            explorer.children[folder.parent_id].push({type: 1, id: folder.folder_id});
    });
	
	temp.documents.forEach(doc => {
		// Add document's info to explorer.documents object by ID
        explorer.documents[doc.doc_id] = doc;
		
		// Add document as child in explorer.children
		if (explorer.children[doc.folder_id] === undefined)
            explorer.children[doc.folder_id] = [{type: 2, id: doc.doc_id}];
        else
            explorer.children[doc.folder_id].push({type: 2, id: doc.doc_id});
	});
	
	temp = null; 
	
	return explorer;
}