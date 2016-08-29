import { session } from "../lib/session";

// Passes socket object and event arguments to handler
// Also sets current session object to socket.session
function call(file: string, socket: SocketIO.Socket, args: IArguments) {
    session.get(socket.id, (session) => {
        socket.session = session;

        require(file).apply(
            null,
            [socket].concat(Array.prototype.slice.call(args))
        );
    });
}

export = (socket: SocketIO.Socket) => {
        
    /* Note Element Events */
    socket.on("get note object"     , function () { call("./notes/get", socket, arguments); });
    socket.on("change note element" , function () { call("./notes/change", socket, arguments); });
    socket.on("import notes"        , function () { call("./notes/import", socket, arguments); });
    socket.on("set note object"     , function () { call("./notes/set", socket, arguments); });

    /* Non-Note Document Events */
    socket.on("get document content"    , function () { call("./documents/get", socket, arguments); });
    socket.on("update document content" , function () { call("./documents/update", socket, arguments); });
    socket.on("set document syntax"     , function () { call("./documents/syntax", socket, arguments); });

    /* Explorer Events */
    socket.on("get filesystem"        , function () { call("./explorer/get", socket, arguments); });
    socket.on("create object"         , function () { call("./explorer/create", socket, arguments); });
    socket.on("move object to folder" , function () { call("./explorer/move", socket, arguments); });
    socket.on("delete object"         , function () { call("./explorer/delete", socket, arguments); });
    socket.on("find objects"          , function () { call("./explorer/find", socket, arguments); });
    socket.on("rename object"         , function () { call("./explorer/rename", socket, arguments); });
    socket.on("duplicate document"    , function() { call("./explorer/duplicate", socket, arguments); })
    socket.on("close document", (doc: number) => socket.leave('' + doc));

    /* Document Contributor Management Events */
    socket.on("add contributor"      , function () { call("./contributors/add", socket, arguments); });
    socket.on("remove contributor"   , function () { call("./contributors/remove", socket, arguments); });
    socket.on("set user permissions" , function () { call("./contributors/permissions", socket, arguments); });
    socket.on("list contributors"    , function () { call("./contributors/list", socket, arguments); });

    /* User Events */
    socket.on("get user info"         , function () { call("./user/get", socket, arguments); });
    socket.on("login user"            , function () { call("./user/login", socket, arguments); });
    socket.on("update user info"      , function () { call("./user/update", socket, arguments); });
    socket.on("purchase subscription" , function () { call("./user/purchase", socket, arguments); });
    socket.on("update config"         , function () { call("./user/config", socket, arguments); });
    socket.on("get ads"               , function () { call("./user/ad", socket, arguments); });

    /* Shortcut Events */
    socket.on("create shortcut"  , function () { call("./shortcuts/create", socket, arguments); });
    socket.on("delete shortcut"  , function () { call("./shortcuts/delete", socket, arguments); });

    /* Version Control Events */
    socket.on("create version" , function () { call("./versions/create", socket, arguments); });
    socket.on("load version"   , function () { call("./versions/load", socket, arguments); });
    socket.on("delete version" , function () { call("./versions/delete", socket, arguments); });
    socket.on("list versions"  , function () { call("./versions/list", socket, arguments); });

    socket.on("disconnect", () => session.destroy(socket.id));

}