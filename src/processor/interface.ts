import { IEnvironment, IMayaTriggerDefinition } from "../parser/core/interface";

export interface MayaTriggerProcessorConstructor {
    environment: IEnvironment
    trigger: IMayaTriggerDefinition;
}