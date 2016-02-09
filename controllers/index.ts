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

/*
    Returns appropriate file via Express on GET requests
    -
    Sets the controller functions for each socket event in each namespace
*/
export module controllers {

    // Express GET / route handler
    export function home(req, res) {

        res.sendFile(__dirname + "/views/Home.html");

    }

    // Express GET /* route handler
    export function app(req, res) {

        res.sendFile(__dirname + "/views/App.html");

    }

    // Called on connection to /notes socket namespace
    export function notes(socket: SocketIO.Socket) {
        
        socket.on("get"    , function () { call("./notes/get", socket, arguments); });
        socket.on("update" , function () { call("./notes/update", socket, arguments); });
        socket.on("delete" , function () { call("./notes/delete", socket, arguments); });
        socket.on("create" , function () { call("./notes/create", socket, arguments); });
        socket.on("disconnect", () => session.destroy(socket.id));

    }

    // Called on connection to /pages socket namespace
    export function pages(socket: SocketIO.Socket) {

        socket.on("get"        , function () { call("./pages/get", socket, arguments); });
        socket.on("update"     , function () { call("./pages/update", socket, arguments); });
        socket.on("set syntax" , function () { call("./pages/syntax", socket, arguments); });
        socket.on("disconnect", () => session.destroy(socket.id));

    }

    // Called on connection to /explorer socket namespace
    export function explorer(socket: SocketIO.Socket) {

        socket.on("get"    , function () { call("./explorer/get", socket, arguments); });
        socket.on("create" , function () { call("./explorer/create", socket, arguments); });
        socket.on("move"   , function () { call("./explorer/move", socket, arguments); });
        socket.on("delete" , function () { call("./explorer/delete", socket, arguments); });
        socket.on("find"   , function () { call("./explorer/find", socket, arguments); });
        socket.on("rename" , function () { call("./explorer/rename", socket, arguments); });

        socket.on("close"      , (doc: number) => socket.leave(''+doc));
        socket.on("disconnect" , () => session.destroy(socket.id));

    }

    // Called on connection to /user socket namespace
    export function user(socket: SocketIO.Socket) {

        socket.on("get"             , function () { call("./user/get", socket, arguments); });
        socket.on("login"           , function () { call("./user/login", socket, arguments); });
        socket.on("update"          , function () { call("./user/update", socket, arguments); });
        socket.on("create shortcut" , function () { call("./user/create-shortcut", socket, arguments); });
        socket.on("delete shortcut" , function () { call("./user/delete-shortcut", socket, arguments); });

        socket.on("disconnect", () => session.destroy(socket.id));

    }

}