var dotenv = require("dotenv");
dotenv.config();
import * as builder from "botbuilder";
import * as restify from "restify";
import corsMiddleware from "restify-cors-middleware";
import { RasaRecognizer } from "./recognizer";
import { CustomChatConnector } from "./connector";
import { registerDialogs } from "./dialog";
import { dontUnderstandDialog } from "./notunderstood";
import { repeat } from "./utils";

const ERROR_DIALOG = "ERROR_DIALOG";
const config = {
  exitLexic: ["cancel", "exit", "quit", "stop" ]
};

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function() {
  console.log(`Listening to ${server.url}`);
});

// CORS filter headers
const cors = corsMiddleware({
  origins: [process.env.HTTP_ALLOW_ORIGINS || "*"],
  allowMethods: ["OPTIONS", "GET", "POST"],
  allowHeaders: ["Authorization"]
});

server.pre(cors.preflight);
server.use(cors.actual);

server.use(restify.plugins.queryParser());
server.use(restify.plugins.jsonBodyParser());
// expose static files
server.get(
  "/assets/(.*)?.*",
  restify.plugins.serveStatic({
    directory: `./static`,
    appendRequestPath: false
  })
);

// Custom connector
let customConnector = new CustomChatConnector()

// Listen for messages from users
server.post("/api/messages", customConnector.listen());

let memoryStorage = new builder.MemoryBotStorage();

let rasaRecognizer = new RasaRecognizer({
  project: "meetup",
  host: process.env.NLU_HOST
});

// -----
let bot = new builder.UniversalBot(customConnector, dontUnderstandDialog).set(
  "storage",
  memoryStorage
);

bot.recognizer(rasaRecognizer);


// Accept words to end all conversation and restart
bot.use({
  botbuilder: (session: builder.Session, next: Function): void => {
    if (config.exitLexic.find(w => w === session.message.text)) {
      session.conversationData = {};
      session.send("Ok. What else can I do for you?");
      session.clearDialogStack();
    } else next();
  }
});

bot.on("error", function(data: any) {
  console.log("ERROR", repeat('-', 10), "\n", data, "\n", repeat('-', 10));
  bot.beginDialogAction(ERROR_DIALOG, ERROR_DIALOG);
});

bot.dialog(ERROR_DIALOG, session => { 
  session.endConversation("I'm sorry, something went wrong on my part. Let's restart our conversation. How my I help you?");
})

// register intents dialogs
registerDialogs(bot)