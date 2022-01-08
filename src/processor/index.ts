
import { IMayaTriggerDefinition, IEnvironment, IPrompt } from "../parser/core/interface";
import { PromptWrapper } from "./core/prompt";


class MayaTriggerProcessor {

    private _trigger: IMayaTriggerDefinition;
    private _environment: IEnvironment;
    private _prompt: IPrompt;

    constructor(trigger: IMayaTriggerDefinition) {
        this._trigger = trigger;
        this._environment = trigger.environment || {};
        this._prompt = {}

        this.worker()
    }

    private async worker() {
        await this._collectUserInputs()
    }

    public async _collectUserInputs(): Promise<boolean> {
        if (this._trigger.prompt === null || this._trigger.prompt === undefined) { return false; }

        const variableNames = Object.keys(this._trigger.prompt);
        const promptWrapper = new PromptWrapper(false)

        for (let i = 0; i < variableNames.length; i++) {
            const variableKey = variableNames[i]
            const variableValue = this._trigger.prompt![variableKey];

            if (this._trigger.autonomous) {
                this._prompt[variableKey] = variableValue;
            } else {
                this._prompt[variableKey] = await promptWrapper.askUser(variableKey)
            }
        }

        return true
    }
}

export { MayaTriggerProcessor };
