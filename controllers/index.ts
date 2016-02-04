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
        
        socket.on("get"            , function () { call("./notes/get", socket, arguments); });
        socket.on("update meta"    , function () { call("./notes/updateMeta", socket, arguments); });
        socket.on("update content" , function () { call("./notes/updateContent", socket, arguments); });
        socket.on("delete"         , function () { call("./notes/delete", socket, arguments); });
        socket.on("create"         , function () { call("./notes/create", socket, arguments); });
        socket.on("get children"   , function () { call("./notes/getChildren", socket, arguments); });
        
    }

    // Called on connection to /pages socket namespace
    export function pages(socket: SocketIO.Socket) {

        socket.on("get"            , function () { call("./pages/get", socket, arguments); });
        socket.on("update content" , function () { call("./pages/updateContent", socket, arguments); });
        socket.on("update meta"    , function () { call("./pages/updateMeta", socket, arguments); });

    }

    // Called on connection to /explorer socket namespace
    export function explorer(socket: SocketIO.Socket) {

        socket.on("get"      , function () { call("./explorer/get", socket, arguments); });
        socket.on("get subs" , function () { call("./explorer/getSubs", socket, arguments); });
        socket.on("create"   , function () { call("./explorer/create", socket, arguments); });
        socket.on("move"     , function () { call("./explorer/move", socket, arguments); });
        socket.on("delete"   , function () { call("./explorer/delete", socket, arguments); });

    }

    // Called on connection to /user socket namespace
    export function user(socket: SocketIO.Socket) {

        socket.on("get"    , function () { call("./user/get", socket, arguments); });
        socket.on("login"  , function () { call("./user/login", socket, arguments); });
        socket.on("update" , function () { call("./user/update", socket, arguments); });

    }

}