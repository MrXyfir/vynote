export default function (state) {

    let document = location.hash.substr(1).split('.')[0];

    // Document does not match
    if (state.document.doc_id != document) {
        return false;
    }
    // Note document, check if scope has changed
    else if (state.document.doc_type == 1 && location.hash.split('/')[1]) {
        if (state.document.render.scope !== location.hash.split('/')[1].split('.')[0]) {
            return false;
        }
    }
    
    return true;
    
}