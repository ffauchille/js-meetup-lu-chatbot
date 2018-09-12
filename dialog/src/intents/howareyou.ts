import * as builder from 'botbuilder';
import { NextStep, StepResults } from '../types';
import { BotDialogRegistration } from '../models';

export const HOW_ARE_YOU = 'how are you'
const howareyouDialog =
    (session: builder.Session, args: any, next: NextStep) => {
        session.endDialog(["Good, you?", "Nice what about you?"])
    }

export default [
    new BotDialogRegistration({ intent: HOW_ARE_YOU, dialog: howareyouDialog })
]