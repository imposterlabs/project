import { PromptWrapper } from "./core/prompt";
import { IEnvironment, IPrompt, IMayaRouteDefinition } from "../parser/core/interface";
import { ContextualFunction, IContext } from "../parser/core/context/interface";
import { ContextualFunctionException } from "../exceptions/ContextualFunctionException"

class MayaRouteProcessor {

    private _route: IMayaRouteDefinition
    private _environment: IEnvironment;
    private _prompt: IPrompt;

    constructor(route: IMayaRouteDefinition) {
        this._route = route
        this._environment = route.environment || {};
        this._prompt = {}
    }

    public async process() {
        await this._collectUserInputs()
        await this._transformContextualFunctionToString()
        return {
            environment: this._environment,
            prompt: this._prompt,
            route: this._route
        }
    }

    private async _collectUserInputs(): Promise<boolean> {
        if (this._route.prompt === null || this._route.prompt === undefined) { return false; }

        const variableNames = Object.keys(this._route.prompt);
        const promptWrapper = new PromptWrapper({ autoCloseChannel: false })

        for (let i = 0; i < variableNames.length; i++) {
            const variableKey = variableNames[i]
            const variableValue = this._route.prompt![variableKey];

            if (this._route.autonomous) {
                this._prompt[variableKey] = variableValue;
            } else {
                this._prompt[variableKey] = await promptWrapper.askUser(variableKey)
            }
        }

        return true
    }

    private async _transformContextualFunctionToString(): Promise<void> {
        if (typeof this._route.url === "function") {
            this._route.url = await this._processContextualFunction(this._route.url)
        }

        if (typeof this._route.name === "function") {
            this._route.name = await this._processContextualFunction(this._route.name)
        }

    }

    private async _processContextualFunction<Type>(contextualFunction: ContextualFunction<IContext, Type>): Promise<Type> {
        const contextInsideFunction: IContext = {
            environment: this._environment,
            prompt: this._prompt
        }

        try {
            const returnData = await contextualFunction(contextInsideFunction)
            return returnData
        } catch (e) {
            throw new ContextualFunctionException(`failing contextual function in ${this._route.name}`)
        }
    }


}

export { MayaRouteProcessor };
