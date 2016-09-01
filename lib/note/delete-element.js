/* interface IData { id: string } */

module.exports = function(notes, data) {

    let parent = notes[data.id].parent;

    // Remove data.id from children of parent
    notes[parent].children = notes[parent].children.filter(child => {
        return child != data.id;
    });

    let children = [];

    // Populate children[] with ids of all children elements
    const getChildren = (id) => {
        let c = [];

        notes[id].children.forEach(child => {
            c.push(child);
            c.concat(getChildren(child));
        });

        return c;
    };
    children = getChildren(data.id);

    // Delete child elements in children[]
    children.forEach(child => {
        delete notes[child];
    });

    // Delete data.id
    delete notes[data.id];

}