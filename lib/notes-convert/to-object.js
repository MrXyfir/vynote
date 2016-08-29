import randString = require("../rand-string");

function countLevels(text: string): number {
    let count: number = 0;
    let index: number = 0;

    while (true) {
        if (text.charAt(index++) === "\t")
            count++;
        else
            return count;
    }
}

export = (lines: string[]) => {

    let notes = {
        home: {
            content: "HOME", children: []
        }
    };

    let parents: string[] = ["home"];
    let parent: string = "home";
    let level: number = 0;
    let id: string = "";
    
    lines.forEach((line: string, i: number) => {

        // Generate unique element id
        while (true) {
            id = randString(10);
            if (notes[id] === undefined)
                break;
        }

        // Determine line's level based on tabs in string
        // +1 due to zero-index and 0 being the default "home" parent level
        level = countLevels(line) + 1;

        // Add current note's id to parents[level]
        parents[level] = id;

        // Delete all parents in a level deeper than the current level
        if (parents.length > level)
            parents.splice(level + 1, parents.length - level);

        // The note's parent_id is equal to parents[currentLevel - 1]
        parent = parents[level - 1];

        // Create element in notes object
        notes[id] = {
            content: line.substr(level + 1), parent, flags: [], children: []
        };

        // Add id to parent
        notes[parent].children.push(id);
        
        lines[i] = "";
    });

    return notes;

};