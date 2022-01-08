import axios from "axios"
import { MayaTriggerDefinition } from "./parser/core/interface"
import { METHOD } from "./parser/core/method/index"
import { Context } from "./parser/core/context/interface"


const triggerDefinition: MayaTriggerDefinition = {
    url: "https://webhook.site/b0ae265d-839f-45fa-9774-c2d8bed11ddb",
    body: { something: "awesome", people: [1, 2, 3, 4] },
    method: METHOD.GET
}

const context: Context = {
    environment: {},
    prompt: {}
}

axios.request({
    url: typeof triggerDefinition.url === "string" ? triggerDefinition.url : triggerDefinition.url(context),
    method: triggerDefinition.method.axiosProvider,
    data: triggerDefinition.body,
}).then(res => {
    console.log(res.data)
})
    .catch(err => {
        console.log(err)
    })