interface IData {
    id: string, content: string, parent: string
}

export = (notes: any, data: IData) => {

    notes[data.id] = {
        content: data.content, parent: data.parent, flags: [],
        showChildren: false, children: []
    };

    notes[data.parent].children.push(data.id);

}