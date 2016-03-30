let jsdiff = require("diff");

export default function (oldText, newText) {
    
    let index = 0, diff = [];

    jsdiff.diffChars(oldText, newText).forEach(change => {
        if (change.added) {
            diff.push({
                insert: change.value, at: index
            });
            
            index += change.count;
        }
        else if (change.removed) {
            diff.push({
                remove: true, at: index, for: change.count
            });
        }
        else {
            index += change.count;
        }
    });

    return diff;
  
}
