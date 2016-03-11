interface IData {
    id: string, content: string
}

export = (note: any, data: IData) => {

    note.notes[data.id].content = data.content;

}