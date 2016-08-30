/* interface IData {
    id: string, content: number[]
} */

module.exports = function(notes, data) {

    notes[data.id].flags = data.content;

}