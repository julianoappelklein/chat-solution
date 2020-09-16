import express from "express";
import httpProxy from "express-http-proxy";
import { join, resolve } from "path";
import { router } from "./express-router";
import io from "socket.io";
import { setupSocketsServer } from "./sockets-server/sockets-server";
import bodyParser from 'body-parser';
import { serviceLocator } from "./service-locator";

process.on('uncaughtException', function (err) {
  console.log('Caught exception: ', err);
});

const config = serviceLocator.getConfig();

export const start = () => {
  //start Express
  const app = express();

  app.use(bodyParser.json());
  app.get("/api", (req, res, next) => {
    res.statusCode = 200;
    res.send('Chat Server API');
  });
  app.use("/api", router);

  if (!config.chatServerClientPath) {
    app.use("/", httpProxy("http://localhost:3000"));
  } else {
    const spaFrontendRoot = join(__dirname, "../../chat-client/build");
    app.use(express.static(spaFrontendRoot));
    app.use((err: any, req: any, res: any, next: any) => {
      console.error(err.stack)
      res.status(500).send('Something broke!')
    })

    app.get("*", (req, res, next) => {
      res.sendFile(resolve(join(spaFrontendRoot, "index.html")));
    });
  }
  
  
  app.use(function (err: any, req: any, res: any, next: any) {
    console.error(err.stack)
    res.status(500).send('Something broke!')
  })
  const server = app.listen(3001);

  //Start Sockets
  const ioServer = io({
    path: "/chat",
  }).attach(server);

  setupSocketsServer(ioServer);

  console.log("Chat Server Started");
};
