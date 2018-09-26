# JS Meetup - On premise Chatbot demo

This repository contains all source code presented at the JS Meetup in Luxembourg on the 12th of September 2018.

Serveral projects needs to interact together:


A docker-compose deploys the full stack. To do so, just run the root ```docker-compose.yml``` [(see TL; DR)](#tldr)


## <a name=chat></a> Chat 

Web chat channel forked from [BotFramwork WebChat](https://github.com/Microsoft/BotFramework-WebChat).

It **must** have the following custom configuration to interface with our stack (in ```index.html```):

```
BotChat.App({
        directLine: { domain: "http://localhost:8081/directline", webSocket: false, watermark: "0" },
        user: { id: 'me', name: 'You' },
        chatTitle: 'JS Meetup Chatbot',
        resize: 'detect',
        locale: 'en-US',
        showUploadButton: false
      }
```

File upload and speech are disabled since we do not have any use of it.


## Directline

Simple API enabling the interface of the [BotFramwork WebChat](https://github.com/Microsoft/BotFramework-WebChat) with the
dialog api.

It has the following structure:
```
.
├── package.json
├── src
│   ├── app.ts              // Where we expose the direcline api
│   ├── connection.ts       // Where we handle messages and activities
│   └── utils.ts            // Some utilitary functions
└── tsconfig.json
```

## Dialog

Dialog management is done using [Microsoft Bot builder](https://github.com/Microsoft/BotBuilder) in NodeJS.

Check out [bot builder in NodeJS documentation](https://docs.microsoft.com/en-us/azure/bot-service/nodejs/bot-builder-nodejs-overview?view=azure-bot-service-3.0) for more information about the SDK.

Main code is in ```src/server.ts``` file and every routes are declared.

It uses [Restify](http://restify.com/) to exposer REST APIs.


Here are some details about files
```
├── package.json
├── src
│   ├── connector
│   │   └── index.ts                    // Where the custom chat's connector is implementated.
│   ├── dialog.ts                       // Registers all intent dialogs with the threshold
│   ├── intents                         // 1 file per intent's category
│   │   ├── greetings.ts               
│   │   ├── index.ts                    // All intent's dialogs registrations are declared
│   │   ├── meetupregistration.ts
│   │   ├── myevents.ts
│   │   └── nextmeetup.ts
│   ├── meetupapi                       // Meetup API helpers
│   │   ├── index.ts                    // mainly append API Key and correct QP to each request
│   │   ├── models.ts
│   │   └── types.ts
│   ├── models.ts                       // Some partial classes to parse payloads mostly
│   ├── notunderstood.ts                // failover dialog
│   ├── recognizer                      // Where RASA recognizer is implemented
│   │   └── index.ts
│   ├── server.ts                       // main file where Bot is instanciated
│   ├── types.ts                        // some Typescript Types
│   └── utils.ts                        // Utilitary functions
└── tsconfig.json                       // TypeScript compiler options
```

## NLU

### RASA NLU API

RASA is the NLU method for this demo. 

Check out [RASA Documentation](https://rasa.com/docs/nlu/)

Volume ```nlu/rasa-data``` is mount with docker container

### NLU Trainer

A simple UI to train RASA NLU model.

Training data are persisted in meetup-mongo MongoDB's docker container. Volume is mount by default
in ```nlu/data``` folder

### NLU Trainer API

API handling training data.

The RASA config is generated at every training and can be found on the mounted folder ```nlu/api-data```

Rule for file name is ```[project_name]-[YYYYMMDD]-[HHMMSS].json.yml```.

Training data format is in yml and should respect this [specific yml format](https://rasa.com/docs/nlu/dataformat/)


# <a name="tldr"></a> TL;DR - Main docker compose starting stack

Make sure you've set the MEETUP_API_KEY env var in root's ```docker-compose.yml```
You can create one on [Meetup's website](https://secure.meetup.com/meetup_api/key/)
To launch the chatbot, just run with the root docker compose:

```
    $ docker network create meetup
    
    $ docker-compose pull && docker-compose up -d
```

Two web app should be available:
```
    http://localhost:8090 // web chat
    http://localhost:8091 // NLU trainer
```

Following applications must be deployed (use ```$ docker ps```):
- **js-meetup-chat**                 Web chat channel running on http://localhost:8090
- **js-meetup-directline**           Directline connector to handle dialog's connection
- **js-meetup-dialog**               Dialog engine API using MSFT botbuilder
- **js-meetup-rasa-nlu**             RASA nlu API on which the NLU is implemented in Python
- **js-meetup-nlu-trainer-app**             UI to train NLU's model to be use by chatbot running on http://localhost:8091
- **js-meetup-nlu-trainer-api**             API to persist NLU's models, intents, example and entities
- **js-meetup-mongo**                MongoDB use to persist training data for NLU
