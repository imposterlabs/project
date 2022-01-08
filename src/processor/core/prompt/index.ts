import * as readline from 'readline';

class PromptWrapper {
    private _channel: readline.Interface;
    private _autoCloseChannel: boolean;

    constructor(autoCloseChannel: boolean) {
        this._autoCloseChannel = autoCloseChannel;
        this._channel = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
    }

    public async askUser(question: string): Promise<string> {
        return new Promise((resolve) => {
            this._channel.question(this.preparePromptQuestion(question), (answer: string) => {
                if (this._autoCloseChannel) {
                    this.closeChannel();
                }
                resolve(answer)
            });
        })
    }

    private preparePromptQuestion(question: string): string {
        return `Enter ${question}: `
    }

    private closeChannel() {
        this._channel.close();
    }
}

export { PromptWrapper }
