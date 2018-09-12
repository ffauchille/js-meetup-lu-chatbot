import * as builder from 'botbuilder';
import { NextStep, StepResults } from '../types';
import { BotDialogRegistration } from '../models';
import { MeetupApi } from '../meetupapi';
import { MeetupEvents } from '../meetupapi/models';

export const NEXT_MEETUP_LOCATION = 'next meetup location'
const nextMeetupLocationDialog =
    (session: builder.Session, args: any, next: NextStep) => {
        MeetupApi.get(`/2/events?group_id=${process.env.JAVASCRIPT_LUXEMBOURG_ID}&page=5`, pl => new MeetupEvents(pl))
            .subscribe(
                events => {
                    if (events.results.length > 0) {
                        let locations: string = events.results.reduce((allLocations, event) => allLocations + `\n\n\n**${event.name}**\n*${event.venue.name}*\n${event.venue.address_1}`, "")
                        session.endDialog(locations);
                    } else session.endDialog("No JS Meetups in luxembourg are planned yet")
                },
                err => { 
                    console.log("Error consuming api meetup events: ", err)
                    session.endDialog("Arg, I cannot connect with JS meetup API. You can check on [JS meetup page](https://www.meetup.com/fr-FR/JSLuxembourg/)")
                }
            )
    }

export default [
    new BotDialogRegistration({ intent: NEXT_MEETUP_LOCATION, dialog: nextMeetupLocationDialog })
]