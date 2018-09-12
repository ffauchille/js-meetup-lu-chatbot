import * as builder from 'botbuilder';
import { NextStep, StepResults } from '../types';
import { BotDialogRegistration } from '../models';

export const HELP = 'help'
const helpDialog =
    (session: builder.Session, args: any, next: NextStep) => {
        session.endDialog("What can you do for you?")
    }

export default [
    new BotDialogRegistration({ intent: HELP, dialog: helpDialog })
]