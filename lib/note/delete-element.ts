interface IData { id: string }

export = (notes: any, data: IData) => {

    let parent: string = notes[data.id].parent;

    // Remove data.id from children of parent
    notes[parent].children = notes[parent].children.filter(child => {
        return child != data.id;
    });

    let children: string[] = [];

    // Populate children[] with ids of all children elements
    const getChildren = (id: string): string[] => {
        let c: string[] = [];

        notes[id].children.forEach(child => {
            c.push(child);
            c.concat(getChildren(child));
        });

        return c;
    };
    children = getChildren(data.id);

    // Delete child elements in children[]
    children.forEach(child => {
        delete notes[child];
    });

    // Delete data.id
    delete notes[data.id];

}