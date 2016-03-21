import { loadAd } from "../../actions/modal/ad";

import getKeywords from "./get-keywords";

export default function (socket, store) {
    
    let state = store.getState();
    
    if (!state.document.content || state.modal.action != "") {
        return;
    }
    
    let text = "";
    
    if (state.document.doc_type == 1) {
        let scope = state.document.render.scope;
        
        if (state.document.content[scope].children.length > 0) {
            text = state.document.content[scope].children.map(child => {
                return state.document.content[child].content;
            }).join(" ");
        }
        else {
            text = state.document.content[scope].content;
        }
    }
    else {
        text = state.document.content;
    }
    
    let keywords = getKeywords(text, 25);
    keywords.concat(state.document.name.toLowerCase().split(' '));
    
    socket.emit("get ads", keywords, (ad) => {
        if (ad.link) store.dispatch(loadAd(ad));
    });
    
}