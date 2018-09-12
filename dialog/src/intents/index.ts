import nextMeetupRegistration from "./nextmeetup";
import greetingsRegistration from "./greetings";
import thanksRegistration from "./thanks";
import helpRegistration from "./help";
import nextMeetupLocationRegistration from "./nextmeetuplocation";
import nextMeetupParticipationRegistration from "./meetupparticipantcount";
import  howareyouRegistration from "./howareyou";


export default [
    ...nextMeetupRegistration,
    ...greetingsRegistration,
    ...thanksRegistration,
    ...helpRegistration,
    ...nextMeetupLocationRegistration,
    ...nextMeetupParticipationRegistration,
    ...howareyouRegistration
]