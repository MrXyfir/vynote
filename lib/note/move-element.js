interface IData {
    id: string, parent: string, index: number
}

export = (notes: any, data: IData) => {

    let oldParent: string = notes[data.id].parent;
                
    // Remove element from oldParent.children[]
    notes[oldParent].children = notes[oldParent].children.filter(child => {
        return child != data.id;
    });
                
    // Add element to its parent.children[] at appropriate location
    if (data.index > -1)
        notes[data.parent].children.splice(data.index, 0, data.id);
    else
        notes[data.parent].children.push(data.id);

    // Update element's parent
    notes[data.id].parent = data.parent;

}