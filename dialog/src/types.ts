import * as builder from "botbuilder"

export type BotDialog = builder.IDialogWaterfallStep[] | builder.IDialogWaterfallStep
export type StepResults = builder.IDialogResult<any> | any
export type NextStep = (results?: builder.IDialogResult<any>) => void