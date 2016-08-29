interface IData {
    id: string, content: string
}

export = (notes: any, data: IData) => {

    notes[data.id].content = data.content;

}