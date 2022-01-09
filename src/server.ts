import { METHOD } from "./parser/core/method/index"
import { MayaTriggerProcessor } from "./processor"

const worker = async () => {
    const m = new MayaTriggerProcessor({
        name: "dummy_coffee_api",
        method: METHOD.GET,
        prompt: { enter_hot_or_iced: "hot" },
        url: ({ prompt }) => {
            const { enter_hot_or_iced } = prompt
            return `https://api.sampleapis.com/coffee/${enter_hot_or_iced}`
        },
        autonomous: false
    })


    const data = await m.run()
    console.log(data)
}

worker()