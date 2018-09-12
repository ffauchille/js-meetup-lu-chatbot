import * as builder from "botbuilder";
import { StepResults, NextStep } from "../types";
import { BotDialogRegistration } from "../models";
import { MeetupApi } from "../meetupapi";
import { MeetupEvents, MeetupEvent } from "../meetupapi/models";

export const NEXT_MEETUP = "next meetup"

const eventCard = (session: builder.Session, event: MeetupEvent) => 
    new builder.HeroCard(session)
               .title(event.name)
               .subtitle("JavaScript Luxembourg\n", event.venue, " inscription sofar")
               .text(event.description)

const nextMeetupDialog = 
    (session: builder.Session, args: any, next: NextStep) => {
        let message = new builder.Message(session).attachmentLayout(builder.AttachmentLayout.carousel)
        MeetupApi.get(`/2/events?group_id=${process.env.JAVASCRIPT_LUXEMBOURG_ID}&page=5`, pl => new MeetupEvents(pl))
        .subscribe(
            events => { 
                events.results.forEach(evt => message.addAttachment(eventCard(session, evt)))
                session.endDialog(message)
            },
            err => { 
                console.log("Error consuming api meetup events: ", err)
                session.endDialog("Arg, I cannot connect with JS meetup API. You can check on [JS meetup page](https://www.meetup.com/fr-FR/JSLuxembourg/)")
            }
        )
    }

export default [
    new BotDialogRegistration({ intent: NEXT_MEETUP, dialog: nextMeetupDialog })
]