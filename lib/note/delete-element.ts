interface IData { id: string }

export = (note: any, data: IData) => {

    let parent: string = note.notes[data.id].parent;

    // Remove data.id from children of parent
    note.notes[parent].children = note.notes[parent].children.filter(child => {
        return child != data.id;
    });

    let children: string[] = [];

    // Populate children[] with ids of all children elements
    const getChildren = (id: string): string[] => {
        let c: string[] = [];

        note.notes[id].children.forEach(child => {
            c.concat(getChildren(child));
        });

        return c;
    };
    children = getChildren(data.id);

    // Delete child elements in children[]
    children.forEach(child => {
        delete note.notes[child];
    });

    // Delete data.id
    delete note.notes[data.id];

}