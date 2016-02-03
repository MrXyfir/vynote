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
        
        socket.on("get"            , require("./notes/get"));
        socket.on("update meta"    , require("./notes/updateMeta"));
        socket.on("update content" , require("./notes/updateContent"));
        socket.on("delete"         , require("./notes/delete"));
        socket.on("create"         , require("./notes/create"));
        socket.on("get children"   , require("./notes/getChildren"));
        
    }

    // Called on connection to /pages socket namespace
    export function pages(socket: SocketIO.Socket) {

        socket.on("get"            , require("./pages/get"));
        socket.on("update content" , require("./pages/updateContent"));
        socket.on("update meta"    , require("./pages/updateMeta"));

    }

    // Called on connection to /explorer socket namespace
    export function explorer(socket: SocketIO.Socket) {

        socket.on("get"      , require("./explorer/get"));
        socket.on("get subs" , require("./explorer/getSubs"));
        socket.on("create"   , require("./explorer/create"));
        socket.on("move"     , require("./explorer/move"));
        socket.on("delete"   , require("./explorer/delete"));

    }

    // Called on connection to /user socket namespace
    export function user(socket: SocketIO.Socket) {

        socket.on("get"    , require("./user/get"));
        socket.on("login"  , require("./user/login"));
        socket.on("update" , require("./user/update"));

    }

}