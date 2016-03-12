interface IData {
    id: string, content: number[]
}

export = (note: any, data: IData) => {

    note.notes[data.id].flags = data.content;

}