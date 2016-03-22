let lastState;

function clean(input) {
    return input.replace(
        new RegExp("[^0-9a-zA-Z ]", "g"), ""
    ).replace(
        new RegExp(" ", "g"), "-"
    ).substr(0, 20);
}

export default function (state) {
    
    if (!lastState) {
        lastState = state;
        return;
    }
    
    let hash = "", changed = false;
    
    // Document has changed
    if (lastState.doc_id != state.doc_id) {
        hash = state.doc_id + '.' + clean(state.name);
        changed = true;
    }
    // Scope of note document has changed
    else if (state.doc_type == 1 && state.render) {
        if ((!lastState.render && state.render) || (lastState.render.scope != state.render.scope)) {
            hash = state.doc_id + '.' + clean(state.name)
                + '/' + state.render.scope + '.'
                + clean(state.content[state.render.scope].content);
            changed = true;
        }
    }
    
    if (changed) {
        location.hash = hash;
        lastState = state;
    }
    
}