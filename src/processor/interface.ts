import { AxiosResponse } from "axios";
import { IEnvironment, IMayaTriggerDefinition, IPrompt } from "../parser/core/interface";

export interface MayaTriggerProcessorConstructor {
    environment: IEnvironment
    trigger: IMayaTriggerDefinition;
}

export interface IPreAndPostTriggers {
    before: Array<string>
    after: Array<string>
}

export interface ITriggerResponseHandler {
    environment: IEnvironment,
    prompt: IPrompt,
    trigger: IMayaTriggerDefinition,
    response: AxiosResponse | undefined
}