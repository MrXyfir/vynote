import { hash } from "../crypto";

export default function (notes) {
    
    let id = "";
    
    while (true) {
        id = hash(Math.random().toString(), "sha1").substring(30);
        
        if (notes[id] === undefined) break;
    }
    
    return id;
    
}