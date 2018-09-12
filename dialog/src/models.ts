import * as builder from "botbuilder";
import { BotDialog } from "./types";
import { DEFAULT_INTENT_TRESHOLD } from "./dialog";

export class BotDialogRegistration {
    intent: string;
    dialog: BotDialog;
    intentTreshold: number; // between 0 and 1; default is 0.1
    regex?:string;

    constructor(props: Partial<BotDialogRegistration>) {
        this.intent = props.intent || "";
        this.dialog = props.dialog || ((session: builder.Session) => session.send("It seems I know what you want but I haven't any answer to this yet."));
        this.intentTreshold = props.intentTreshold || DEFAULT_INTENT_TRESHOLD;
        this.regex = props.regex;
    }
}
