import * as builder from "botbuilder";
import { NextStep } from "./types";

const dontUnderstandUtterances = [
  "I'm not sure I understand, could you reformulate your query?",
  "Sorry, I missunderstood that last part. Could you repeat?",
  "I'm afraid I don't follow you, could you please say it again?"
];

const humanNeedsTakeOver = "I'm sorry, I think it is best if you contact a real person for this."
export const DONT_UNDERSTAND_DIALOG = "not understood"
export const dontUnderstandDialog = (
  session: builder.Session,
  args: any,
  next: NextStep
) => {
  if (!session.conversationData.dontUnderstandCpt) {
    session.conversationData.dontUnderstandCpt = 0
  }

  let idx = session.conversationData.dontUnderstandCpt % dontUnderstandUtterances.length;
  let reformulatePlease =
    dontUnderstandUtterances[idx > 2 || idx < 0 ? 0 : idx];
  session.say(reformulatePlease, reformulatePlease, {
    inputHint: builder.InputHint.expectingInput
  });
  session.conversationData.dontUnderstandCpt = idx + 1;
};