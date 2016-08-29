interface IData {
    id: string, content: number[]
}

export = (notes: any, data: IData) => {

    notes[data.id].flags = data.content;

}