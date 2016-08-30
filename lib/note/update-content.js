/* interface IData {
    id: string, content: string
} */

module.exports = function(notes, data) {

    notes[data.id].content = data.content;

}