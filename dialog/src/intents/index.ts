import { registrations as metupRegistration } from "./nextmeetup";
import { registrations as greetingsRegistration } from "./greetings";
import { registrations as myEventsRegistration } from "./myevents";


export default [
    ...metupRegistration,
    ...greetingsRegistration,
    ...myEventsRegistration
]