/* interface IChanges {
    insert?: string, remove?: boolean, at: number, for?: number
} */

module.exports = function(content, changes) {
    
    changes.forEach(change => {
        if (change.insert) {
            content = content.substring(0, change.at)
                + change.insert
                + content.substring(change.at);
        }
        else {
            content = content.substring(0, change.at)
                + content.substring(change.at + change.for);
        }
    });
    
    return content;
    
}