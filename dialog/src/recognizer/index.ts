import * as builder from "botbuilder";
import * as request from "request";
/**
 *
 * Example of rasa response
 *
 * {{{
 *      {
 *        "intent": {
 *          "name": "mobility.mpass",
 *          "confidence": 0.3207837153004153
 *        },
 *        "entities": [],
 *        "intent_ranking": [
 *          {
 *            "name": "mobility.mpass",
 *            "confidence": 0.3207837153004153
 *          },
 *          {
 *            "name": "mobility.ecars.book",
 *            "confidence": 0.17789635486511093
 *          },
 *          ...
 *        ],
 *        "text": "i need my mpass",
 *        "project": "mobility",
 *        "model": "model_20180705-123706"
 *      }
 * }}}
 */
type RasaIntentScore = {
  name: string;
  confidence: number;
};

type RasaParsedEntity = {
  start: number;
  end: number;
  value: string;
  entity: string;
};

export type RasaParseResult = {
  intent: RasaIntentScore;
  entities: RasaParsedEntity[];
  intent_ranking: RasaIntentScore[];
  text: string;
  project: string;
  model: string;
};

export type RasaModelConfig = {
  host: string;
  project: string;
  model?: string;
};

/**
 * Rasa NLU recognizer
 */
export class RasaRecognizer extends builder.IntentRecognizer {
  url: string;
  project: string;
  model?: string;

  static error(msg: string): Error {
    return new Error(`[RASA NLU] ${msg}`);
  }

  /**
   *
   * Construct rasa NLU intent recognizer
   *
   * @param logPrefix:
   * @param config : rasa model config =>
   *  host, project and model for the rasa nlu which
   *  are use to interact with rasa
   *
   */
  constructor(config: RasaModelConfig) {
    super();
    let host = config.host.endsWith("/") ? config.host : config.host + "/";
    this.url = host + "parse";
    this.project = config.project;
    this.model = config.model;
  }

  /**
   * Overriden by derived class to implement the actual recognition logic.
   * @param context Contextual information for a received message that's being recognized.
   * @param callback Function to invoke with the results of the recognition operation.
   * @param callback.error Any error that occurred or `null`.
   * @param callback.result The result of the recognition.
   */
  public onRecognize(
    context: builder.IRecognizeContext,
    callback: (err: Error, result: builder.IIntentRecognizerResult) => void
  ): void {
    let result: builder.IIntentRecognizerResult = { score: 0.0, intent: null };
    if (context && context.message && context.message.text) {
      RasaRecognizer.recognize(context, this.url, this.project, callback);
    } else callback(null, result);
  }

  /**
   * Attempts to match a users text utterance to an intent.
   * @param context Contextual information for a received message that's being recognized.
   * @param callback Function to invoke with the results of the recognition operation.
   */
  static recognize(
    context: builder.IRecognizeContext,
    url: string,
    project: string,
    callback: (err: Error, result: builder.IIntentRecognizerResult) => void
  ): void {

    if (url) {
      if (context && context.message && context.message.text) {
        let pl = {
          url,
          method: "POST",
          json: { q: context.message.text, project },
          headers: { "content-type": "application/json" }
        };

        request.post(pl, (err, response, body) => {
          if (err) {
            callback(
              RasaRecognizer.error(`Rasa post query failed ${err}`),
              null
            );
          } else {
            if (response && response.statusCode === 200) {
              let rasaRes = <RasaParseResult>body;
              callback(null, {
                score: rasaRes.intent.confidence,
                intent: rasaRes.intent.name
              });
            } else
              callback(
                RasaRecognizer.error(
                  `server respond with error code (${
                    response.statusCode
                  }), with message:\n${body}`
                ),
                null
              );
          }
        });
      } else callback(RasaRecognizer.error("no message in context"), null);
    } else callback(RasaRecognizer.error("no model URL"), null);
  }
}
