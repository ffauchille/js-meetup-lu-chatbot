import * as builder from "botbuilder";
import { NextStep, StepResults } from "../types";
import { BotDialogRegistration } from "../models";

export const THANKS = "thanks"
const thanksDialog =
    (session: builder.Session, args: any, next: NextStep) => {
        session.endDialog(["Anytime!", "No problem, I'm happy to help", "You're welcome!"])
    }

export default [
    new BotDialogRegistration({ intent: THANKS, dialog: thanksDialog })
]