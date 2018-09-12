import * as builder from "botbuilder";
import { NextStep } from "../types";
import { MeetupApi } from "../meetupapi";
import { BotDialogRegistration } from "../models";

export const MY_EVENTS = "my events"
const myeventsDialog = (session: builder.Session, args: any, next: NextStep) => {
    session.endDialog("Check it out yourself [here](https://www.meetup.com/fr-FR/JSLuxembourg/) ...")
}

export const registrations = [
    new BotDialogRegistration({ intent: MY_EVENTS, dialog: myeventsDialog })
]