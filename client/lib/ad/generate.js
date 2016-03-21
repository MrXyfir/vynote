import { loadModalAd } from "../../actions/modal/";
import { loadNotificationAd } from "../../actions/notification";

import getKeywords from "./get-keywords";

function generate(socket, store) {
    
    let state = store.getState();
    
    // Wait until a document with content is open
    if (!state.document.content) {
        setTimeout(() => { generate(socket, store); }, 30 * 1000);
        return;
    }
    
    let text = "";
    
    // Get text to find keywords in
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
    
    // Generate keywords from text and document name
    let keywords = getKeywords(text, 25);
    keywords.concat(state.document.name.toLowerCase().split(' '));
    
    // Get ad from server
    socket.emit("get ads", keywords, (ad) => {
        // Server could not find ad
        if (ad.type === undefined) {
            return;
        }
        // Display ad in notification bar
        else if (ad.type == 2 || state.modal.action != "" || Math.round(Math.random())) {
            store.dispatch(loadNotificationAd(ad));
        }
        // Display ad in modal
        else {
            store.dispatch(loadModalAd(ad));
        }
    });
    
}

export default generate;