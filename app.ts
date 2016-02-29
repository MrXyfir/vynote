/// <reference path="typings/socket.io/socket.io.d.ts" />
/// <reference path="typings/express/express.d.ts" />
/// <reference path="typings/request/request.d.ts" />
/// <reference path="typings/mysql/mysql.d.ts" />
/// <reference path="typings/redis/redis.d.ts" />
/// <reference path="typings/node/node.d.ts" />

import * as express from "express";
import * as socket from "socket.io";
import * as http from "http";

// Create servers / applications
let app = express();
let server = http.createServer(app);
let io = socket(server);

let config = require("./config").environment;

server.listen(config.port, () => { console.log("SERVER RUNNING ON ", config.port); });

// Express middleware / controllers
app.use('/', express.static(__dirname + "/public"));
app.get('/', (req, res) => {
    res.sendFile(__dirname + "/views/Home.html");
});
app.get("/workspace/*", (req, res) => {
    res.sendFile(__dirname + "/views/App.html");
});

io.on("connection", require("./controllers/"));