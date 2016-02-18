import io from "socket.io-client";

import { URL } from "../constants/config";

// Event handlers
import onUpdateSyntax   from "./update-syntax";
import onUpdateContent  from "./update-content";
import onCreateElement  from "./create-element";
import onDeleteElements from "./delete-elements";
import onUpdateElement  from "./update-element";

export default function (store) {

    // Works like call in ../../controllers/ except it
    // passes store object instead of socket object
    const call = (func, args) => {
        func.apply(null, [store].concat(Array.prototype.slice.call(args)));
    };

    let socket = io(URL);

    socket.on("update syntax"   , function () { call(onUpdateSyntax   , arguments) });
    socket.on("update content"  , function () { call(onUpdateContent  , arguments) });
    socket.on("create element"  , function () { call(onCreateElement  , arguments) });
    socket.on("delete elements" , function () { call(onDeleteElements , arguments) });
    socket.on("update element"  , function () { call(onUpdateElement  , arguments) });

    return socket;

}