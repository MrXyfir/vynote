import * as request from "request";
import db = require("../../lib/db");

export = (socket: SocketIO.Socket, keywords: string[], fn: Function) => {

    if (socket.session.subscription > Date.now()) {
        fn({});
        return;
    }

    let url: string = require("../../config").address.xad
        + "&types=1,2,3&count=1&keywords=" + keywords.join(",")
        + "&ip=" + socket.handshake.address;

    request(encodeURI(url), (err, res, body) => {
        body = JSON.parse(body);
        fn(!body.ads.length ? {} : body.ads[0]);
    });

};