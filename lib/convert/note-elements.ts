interface INoteElement {
    note_id: number, parent_id: number, content: string
}

export = (elements: INoteElement[]) => {
    let note = {
        ref: {
            // id: [child: number, child2: number, ...]
        },
        notes: {
            // id: { parent: number, content: string }
        }
    };

    elements.forEach(element => {
        // Add note's parent and content to note.notes object by ID
        note.notes[element.note_id] = {
            parent: element.parent_id, content: element.content
        };

        // Add note as child for element.parent_id in ref
        if (note.ref[element.parent_id] === undefined)
            note.ref[element.parent_id] = [element.note_id];
        else
            note.ref[element.parent_id].push(element.note_id);
    });
    elements = null;

    return note;
}