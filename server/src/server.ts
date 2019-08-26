import Koa from "koa";
import Http from "http";
import Socketio from "socket.io";

const app = new Koa();
const server = Http.createServer(app.callback());
const io = Socketio(server);

io.on("connection", function(client) {
  client.on("message", function(payload) {
    // TODO: basic 1
  });

  client.on("enter", function(userName) {
    // TODO: advanced 1 & 2
  });

  client.on("leave", function(userName) {
    // TODO: advanced 1 & 2
  });

  client.on("privateMessage", function(payload) {
    // TODO: advanced 3
  });

  client.on("disconnect", function() {
    // TODO: advanced 2
  });

  client.on("error", function(err) {
    console.log(`Client with id ${client.id} threw error ${err}`);
    io.emit("error", err);
  });
});

server.listen(3100);

console.log("Server running on port 3100");
