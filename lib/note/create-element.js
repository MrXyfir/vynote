interface IData {
    id: string, content: string, parent: string, index: number
}

export = (notes: any, data: IData) => {

    notes[data.id] = {
        content: data.content, parent: data.parent,
        flags: [], children: []
    };

    if (data.index > -1)
        notes[data.parent].children.splice(data.index, 0, data.id);
    else
        notes[data.parent].children.push(data.id);

}