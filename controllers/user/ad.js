const request = require("request");
const db = require("lib/db");

const config = require("config");

module.exports = function(socket, keywords, fn) {

    if (socket.session.subscription > Date.now()) {
        fn({});
        return;
    }

    let url = config.address.xad
        + "&types=1,2,3&count=1&keywords=" + keywords.join(",")
        + "&ip=" + socket.handshake.address;

    request(encodeURI(url), (err, res, body) => {
        body = JSON.parse(body);
        fn(!body.ads.length ? {} : body.ads[0]);
    });

}