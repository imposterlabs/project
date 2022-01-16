import { PromptWrapper } from "./core/prompt";
import { IMayaTriggerDefinition, IEnvironment, IPrompt, IHeader } from "../parser/core/interface";
import { ContextualFunction, IContext } from "../parser/core/context/interface";
import { ContextualFunctionException } from "../exceptions/ContextualFunctionException"
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { CommonBaseClass } from "../common/class";
import { IPreAndPostTriggers, ITriggerResponseHandler } from "./interface";

class MayaTriggerProcessor extends CommonBaseClass {

    public _trigger: IMayaTriggerDefinition;
    public _environment: IEnvironment;
    public _prompt: IPrompt;
    public _response: AxiosResponse | undefined

    constructor(trigger: IMayaTriggerDefinition) {
        super("MayaTriggerProcessor")

        this._trigger = trigger;
        this._environment = trigger.environment || {};
        this._prompt = {}
        this._response = undefined
    }

    public getPreAndPostTriggers(): IPreAndPostTriggers {
        return {
            before: this._trigger.before || [],
            after: this._trigger.after || []
        }
    }

    public async run() {
        await this._collectUserInputs()
        await this._transformContextualFunctionToString()
        await this._triggerAxiosRequest()
        await this._executeUserPassedResponseFunction()

    }

    public async _collectUserInputs(): Promise<boolean> {
        if (this._trigger.prompt === null || this._trigger.prompt === undefined) { return false; }

        const variableNames = Object.keys(this._trigger.prompt);
        const promptWrapper = new PromptWrapper({ autoCloseChannel: false })

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

    public async _transformContextualFunctionToString(): Promise<void> {
        if (typeof this._trigger.body === "function") {
            this._trigger.body = await this._processContextualFunction(this._trigger.body)
        }

        if (typeof this._trigger.header === "function") {
            this._trigger.header = await this._processContextualFunction(this._trigger.header)
        }

        if (typeof this._trigger.url === "function") {
            this._trigger.url = await this._processContextualFunction(this._trigger.url)
        }

        if (typeof this._trigger.name === "function") {
            this._trigger.name = await this._processContextualFunction(this._trigger.name)
        }

    }

    public async _processContextualFunction<Type>(contextualFunction: ContextualFunction<IContext, Type>): Promise<Type> {
        const contextInsideFunction: IContext = {
            environment: this._environment,
            prompt: this._prompt
        }

        try {
            const returnData = await contextualFunction(contextInsideFunction)
            return returnData
        } catch (e) {
            throw new ContextualFunctionException(`failing contextual function in ${this._trigger.name}`)
        }
    }

    public async _triggerAxiosRequest(): Promise<void> {
        const config: AxiosRequestConfig = {
            url: this._trigger.url as string,
            method: this._trigger.method.axiosProvider,
            headers: this._trigger.header as IHeader,
            data: this._trigger.body,
        }

        const response = await axios.request(config)
        this._response = response
    }

    private async _executeUserPassedResponseFunction() {
        const contextInsideFunction: ITriggerResponseHandler = {
            environment: this._environment,
            prompt: this._prompt,
            trigger: this._trigger,
            response: this._response
        }

        try {
            if (typeof this._trigger.response === "function") {
                await this._trigger.response(contextInsideFunction)
            }
        } catch (e) {
            throw new ContextualFunctionException(`failing response function in ${this._trigger.name}`)
        }

    }
}

export { MayaTriggerProcessor };
