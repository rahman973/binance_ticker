const express = require("express");
const http = require("http");
const socketio = require("socket.io");
const app = express();
const server = http.createServer(app);
const io = socketio(server);
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
require("dotenv").config();
const dbConnect = require("./config/db");

dbConnect();
app.use(cors());

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

global.io = io;

const Binance = require("node-binance-api");
const binance = new Binance().options({
  APIKEY: process.env.BINANCE_API_KEY,
  APISECRET: process.env.BINANCE_APISECRET,
});

global.binance = binance;

app.use("/", function (req, res) {
  io.on("connection", function (socket) {
    console.log("A user connected");

    //Whenever someone disconnects this piece of code executed
    socket.on("disconnect", function () {
      console.log("A user disconnected");
    });
  });
  res.send({ message: "hello" });
});

io.on("connection", (socket) => {
  console.log("a user connected");
  socket.emit("newclientconnect", "Hey, welcome!");
  binance.futuresMiniTickerStream((miniTicker) => {
    io.emit("ticker", miniTicker);
  });
});

app.use("/api/v1", require("./v1/routes"));

const _port = process.env.PORT || 3001;

server.listen(_port, () => console.info(`Listening on port ${_port}.`));
