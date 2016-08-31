require("app-module-path").addPath(__dirname);

const express = require("express");
const socket = require("socket.io");
const http = require("http");

const config = require("config");

// Create servers / applications
let app    = express();
let server = http.createServer(app);
let io     = socket(server);

server.listen(config.environment.port, () => {
    console.log("~~Server running on port", config.environment.port);
});

// Express middleware / controllers
app.use("/static", express.static(__dirname + "/static"));
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/views/Home.html");
});
app.get("/workspace/*", (req, res) => {
    res.sendFile(__dirname + "/views/App.html");
});

io.on("connection", require("./controllers/"));