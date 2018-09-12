import * as builder from 'botbuilder';
import { NextStep, StepResults } from '../types';
import { BotDialogRegistration } from '../models';
import { MeetupApi } from '../meetupapi';
import { MeetupEvents } from '../meetupapi/models';

export const MEETUP_PARTICIPANT_COUNT = 'meetup participant count'
const meetupParticipantCountDialog =
    (session: builder.Session, args: any, next: NextStep) => {
        MeetupApi.get(`/2/events?group_id=${process.env.JAVASCRIPT_LUXEMBOURG_ID}&page=5`, pl => new MeetupEvents(pl))
            .subscribe(
                events => {
                    if (events.results.length > 0) {
                        let evt = events.results[0];
                        session.endDialog(`There are currently ${evt.yes_rsvp_count} participants registered for ${evt.name} hosted in ${evt.venue.name} (${evt.venue.address_1})`);
                    } else session.endDialog("No JS Meetups in luxembourg are planned yet")
                },
                err => { 
                    console.log("Error consuming api meetup events: ", err)
                    session.endDialog("Arg, I cannot connect with JS meetup API. You can check on [JS meetup page](https://www.meetup.com/fr-FR/JSLuxembourg/)")
                }
            )
    }

export default [
    new BotDialogRegistration({ intent: MEETUP_PARTICIPANT_COUNT, dialog: meetupParticipantCountDialog })
]