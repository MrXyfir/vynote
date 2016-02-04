import io from "socket.io-client";

export default class socket {

    constructor(store) {
        this.sockets = {};
        this.store = store;
    }

    initialize(namespace) {
        switch (namespace) {
            case "users":
                // this.sockets[namespace].on("event", require("./namespace/event"));
                break;
            case "notes":
                break;
            case "pages":
                break;
            case "explorer":
                break;
        }
    }

    emit(namespace, args) {
        // Create socket and initialize event handlers if not already done
        if (this.sockets[namespace] === undefined) {
            this.sockets[namespace] = io(url + "/" + namespace);
            this.initialize(namespace);
        }

        // Call .emit on namespace socket with arguments
        // args is array-like object
        // args[0] is event name
        this.sockets[namespace].emit.apply(
            null,
            [].concat(Array.prototype.slice.call(args))
        );
    }

}