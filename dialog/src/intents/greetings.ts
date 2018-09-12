import * as builder from "botbuilder";
import { NextStep, StepResults } from "../types";
import { BotDialogRegistration } from "../models";

export const GREETINGS = "greetings"
const greetingsDialog =
    (session: builder.Session, args: any, next: NextStep) => {
        session.endDialog(["Hi, what can I do for you?", "Hello there, how my I help you with?", "Good day, how can I help you with?"])
    }

export const registrations = [
    new BotDialogRegistration({ intent: GREETINGS, dialog: greetingsDialog })
]