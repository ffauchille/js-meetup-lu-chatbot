import * as builder from "botbuilder";
import { BotDialogRegistration } from "../models";
import { StepResults, NextStep } from "../types";

export const MEETUP_PARTICIPANT_REGISTRATION = "meetup registration participant";
export const MEETUP_SPEAKER_REGISTRATION = "meetup registration speaker";

const participantRegistration = [
    (session: builder.Session, args: any, next: NextStep) => {
        session.conversationData.noActionTrigger = true;
        builder.Prompts.text(session, "Which meetup would you like to participate?")
    }, (session: builder.Session, results: StepResults, next: NextStep) => {
        
    }
]

const speakerRegistration = [
    (session: builder.Session, args: any, next: NextStep) => {
        session.conversationData.noActionTrigger = true;
        builder.Prompts.text(session, "Which meetup would you like to speak?")
    }
]

export const registrations = [
    new BotDialogRegistration({ intent: MEETUP_PARTICIPANT_REGISTRATION, dialog: participantRegistration }),
    new BotDialogRegistration({ intent: MEETUP_SPEAKER_REGISTRATION, dialog: speakerRegistration })
]
