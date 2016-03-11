interface IData {
    id: string, content: string, parent: string
}

export = (note: any, data: IData) => {

    note.notes[data.id] = {
        content: data.content, parent: data.parent, flags: [],
        showChildren: false, children: []
    };

    note.notes[data.parent].children.push(data.id);

}