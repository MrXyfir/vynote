export default function (temp, scope) {
	let explorer = {
		folders: {},
		documents: {},
		scope
	};
	
	temp.folders.forEach(folder => {
        // Add folder's parent and name to explorer.folders object by ID
        explorer.folders[folder.folder_id] = {
            parent: folder.parent_id, name: folder.name
        };
    });
	
	temp.documents.forEach(doc => {
		// Add document's info to explorer.documents object by ID
        explorer.documents[doc.doc_id] = doc;
	});
	
	temp = null; 
	
	return explorer;
}