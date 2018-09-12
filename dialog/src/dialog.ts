import * as builder from 'botbuilder';
import intentDialogRegistrations from "./intents";
import { BotDialogRegistration } from './models';
import { DONT_UNDERSTAND_DIALOG } from './notunderstood';

export const DEFAULT_INTENT_TRESHOLD: number = 0.8;

/**
 * 
 * Handler to register dialog
 * 
 * @param bot: univeral bot on which dialogs will be registered
 * @param registration: intent, dialog and treshold on the intent to be registered
 */
function register(bot : builder.UniversalBot, registration: BotDialogRegistration): void {
    /**
     * 
     * onSelectAction is called after the action is trigger on the intent's dialog. 
     * We don't want it to break prompts while the bot in inside a waterfall step.
     * So by setting 
     * 
     *          session.conversationData.noActionTrigger = true 
     * 
     * before builder.Prompts.(...), no action will be triggered.
     * 
     * On select action hack to counter the action trigger 
     * when being in the middle of a prompt message
     * @see https://github.com/Microsoft/BotBuilder/issues/3760
     */
    bot.dialog(registration.intent, registration.dialog).triggerAction({
        matches: registration.regex || registration.intent,
        intentThreshold: registration.intentTreshold,
        onSelectAction: (session: builder.Session, args: builder.IActionRouteData) => {
            console.log("regonize result with ", args)
            if (session.conversationData && session.conversationData.noActionTrigger) {
                console.log("Action triggred in middle of prompt; we chose to ignore it")
                session.endDialog();
            } else {
                if (args && args.intent && args.intent.score > DEFAULT_INTENT_TRESHOLD) {
                    session.beginDialog(args.action);
                } else session.beginDialog(DONT_UNDERSTAND_DIALOG);
            }
        }
    });
}

export const endPromptsDialog = (session: builder.Session, textOrMessage?: builder.TextOrMessageType, ...args: any[]) => {
    session.conversationData.noActionTrigger = false;
    session.endDialog(textOrMessage, args);
}

export const registerDialogs = (bot: builder.UniversalBot) => intentDialogRegistrations.forEach((registration: BotDialogRegistration) => {
    if (registration.intent) {
        console.log("registration of ", registration.intent, " with intent treshold at ", registration.intentTreshold || DEFAULT_INTENT_TRESHOLD)
        register(bot, registration)
    } else console.log("Ignoring one registration", registration)
})