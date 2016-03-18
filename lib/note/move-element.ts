interface IData {
    id: string, parent: string, index: number
}

export = (notes: any, data: IData) => {

    let oldParent: string = notes.content[data.id].parent;
                
    // Remove element from oldParent.children[]
    notes.content[oldParent].children = notes.content[oldParent].children.filter(child => {
        return child != data.id;
    });
                
    // Add element to its parent.children[] at appropriate location
    if (data.index > -1)
        notes.content[data.parent].children.splice(data.index, 0, data.id);
    else
        notes.content[data.parent].children.push(data.id);

}