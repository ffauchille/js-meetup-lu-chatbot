import * as restify from "restify";
import * as request from "request"
import {
  ConnectionRegistry,
  genToken,
  genConversationId,
  bot
} from "./connection";
import { Activity, Conversation, Message } from "botframework-directlinejs";
import { joinPath } from "./utils";

if (process.env.MODE === "dev") {
  var dotenv = require("dotenv");
  dotenv.config({});
}

var corsMiddleware = require("restify-cors-middleware");

// Setup Restify Server
var server = restify.createServer();

// CORS filter headers
const cors = corsMiddleware({
  origins: [ process.env.HTTP_ALLOW_ORIGINS ],
  allowMethods: ["OPTIONS", "GET", "POST"],
  allowHeaders: ["Authorization"]
});

const errorDefaultMessage = process.env.DEFAULT_ERROR_MESSAGE || "Sorry but something went wrong on my side :( Please try again later."

server.pre(cors.preflight);
server.use(cors.actual);

server.use(restify.plugins.queryParser());
server.use(restify.plugins.jsonBodyParser());
// Adding no cache control to disable cache while client polls for activities
server.use((req, res, next) => {
  res.once('header', () => {
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '-1');
  });
  next();
})

const stringifySuffix = (nbr: number): string => {
  const base = "0000000";
  return base.slice(0, base.length - nbr.toString().length) + nbr.toString();
};

const postMessageToBot = (act: Activity, cb: (err, res, body) => void) => {
  var options: request.Options = {
    method: "POST",
    url: joinPath(process.env.CHATBOT_API_HOST, "/api/messages"),
    json: true,
    body: act,
    headers: { "Content-Type": "application/json" }
  }

  request(options, cb)
}

const activitiesHandler = (req: restify.Request, res: restify.Response) => {
  var convId: string = req.params ? req.params.convId : "none";
  var cpt = parseInt(ConnectionRegistry.latestActivity(convId).watermark);
  cpt = isNaN(cpt) ? 0 : cpt;
  let suffix = stringifySuffix(cpt);
  cpt += 1;
  let nextSuffix = stringifySuffix(cpt);
  let messageIdForIncMessage = `${convId}|${suffix}`;
  var messageIdForNextActivity = `${convId}|${nextSuffix}`;
  if (req.body) {
    let obj = typeof req.body === 'string' ? JSON.parse(req.body) : req.body
    let act = { ...obj, conversation: { id: convId } } as Activity
    if (act.from && act.from.id !== "botid") {
      postMessageToBot(act, (err: any, res: request.Response, body: any) => {
        if (err) {
          console.error("Error posting activity to bot: ", err, " errno is ", err.errno)
          if (err.errno && err.errno === "ECONNREFUSED" ) {
            ConnectionRegistry.addActivities(convId, [ { ...act, id: messageIdForNextActivity, from: bot, text: "I'm a bit hangover today, I cannot reach the server :( Please contact a human"} as Message ])
          } else ConnectionRegistry.addActivities(convId, [ { ...act, id: messageIdForNextActivity, from: bot, text: errorDefaultMessage } as Message ])
        }
      })
    } else ConnectionRegistry.addActivities(convId, [ { ...act, id: messageIdForNextActivity, from: bot, textFormat: "markdown" } as Message ])
  } else console.error("No body payload in request")
  res.send(200, { id: messageIdForIncMessage });
};

server.post("/directline/conversations/:convId/activities", activitiesHandler);

server.post(
  "/directline/conversations",
  (_: restify.Request, res: restify.Response) => {
    // new conversation
    let conversationId: string = genConversationId();
    let token: string = genToken();
    console.log("New conversation ", conversationId);

    let streamUrl: string = `ws://${process.env.APP_URL ||
      "localhost:8081"}/directline/conversations/${conversationId}/stream?watermark=-&t=${token}`;
    let conversation: Conversation = { token, conversationId, streamUrl };
    res.send(201, conversation);
  }
);

server.get(
  "/directline/conversations/:convId",
  (req: restify.Request, res: restify.Response) => {
    // taking back conv
    var convId: string = "none";
    if (req.params && req.params.convId) {
      convId = req.params.convId;
    }
    res.send(200, { id: convId });
  }
);

server.get(
  "/directline/conversations/:convId/activities",
  (req: restify.Request, res: restify.Response, next: restify.Next) => {
    if (req.params && req.params.convId && req.query && req.query.watermark) {
      let convId = req.params.convId;
      let ag = ConnectionRegistry.latestActivity(convId);
      if (ag.activities.length > 0) {
        ConnectionRegistry.pollConsumed(convId, req.query.watermark);
      }
      res.send(200, ag);
    } else next();
  }
);

server.listen(process.env.port || process.env.PORT || 8081, function() {
  console.log(`Listening to ${server.url}`);
});
