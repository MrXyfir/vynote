/// <reference path="typings/socket.io/socket.io.d.ts" />
/// <reference path="typings/express/express.d.ts" />
/// <reference path="typings/mysql/mysql.d.ts" />
/// <reference path="typings/node/node.d.ts" />

import * as express from "express";
import * as socket from "socket.io";
import * as http from "http";

import { controllers } from "./controllers/";

// Create servers / applications
let app = express();
let server = http.createServer(app);
let io = socket(server);

let config = require("./config").environment;

server.listen(config.port, () => { console.log("SERVER RUNNING ON ", config.port); });

// Server static files in /public
// Any get request not to a /public file hits view controller
app.use('/', express.static(__dirname + "/public"));
app.get("/*", controllers.view);

// Set main controllers for each socket namespace
io.of("/notes").on("connection", controllers.notes);
io.of("/pages").on("connection", controllers.pages);
io.of("/explorer").on("connection", controllers.explorer);