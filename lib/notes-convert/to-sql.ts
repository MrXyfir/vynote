import { escape } from "mysql";

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

export = (doc: number, lines: string[]): string => {

    let parents: number[] = [0];
    let parent: number = 0;
    let level: number = 0;
    let id: number = 0;

    let sql: string = `
        INSERT INTO note_elements (doc_id, parent_id, note_id, content) VALUES 
    `;
    
    lines.forEach((line: string, i: number) => {
        // + 1 since default index is 0
        // 0 is the root parent id, no element should have it
        id = i + 1;

        // Determine line's level based on tabs in string
        // +1 due to zero-index and 0 being the default parent id
        level = countLevels(line) + 1;

        // Add current note's id to parents[level]
        parents[level] = id;

        // Delete all parents on a level lower than the current level
        if (parents.length > level)
            parents.splice(level + 1, parents.length - level);

        // The note's parent_id is equal to parents[currentLevel - 1]
        // If on level one, parent id is 0
        parent = parents[level - 1];

        // For line: start string at current level + 1 to bypass any tabs and the "- "
        // at the beginning of the string
        sql += `('${doc}', '${parent}', '${id}', ${escape(line.substr(level + 1))}), `;
        
        lines[i] = "";
    });

    // Delete ", " from end of string
    return sql.substr(0, sql.length - 2);

};