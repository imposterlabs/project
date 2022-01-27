import { StateHandler } from "."

/**
 * Sample usage:
 * 
 * const { get: getSimpleState, set: setSimpleState } = (new StateHandler<string>("default_value")).getPair()
 */

describe("StateHandler", () => {

    it("should be defined", () => {
        expect(StateHandler).toBeDefined();
    })

    it("should return callable get and set objects", () => {
        const { get: getSimpleState, set: setSimpleState } = (new StateHandler<string>("default_value")).getPair()
        expect(getSimpleState).toBeDefined();
        expect(setSimpleState).toBeDefined();

        expect(typeof getSimpleState).toBe("function");
        expect(typeof setSimpleState).toBe("function");
    })

    it("should initialize with default value passed", () => {
        const randomString = Math.random().toString(36).substring(7)

        const { get: getSimpleState, set: setSimpleState } = (new StateHandler<string>(randomString)).getPair()
        expect(getSimpleState()).toBe(randomString);
    })

    it("should update values with set", () => {
        const firstRandomString = Math.random().toString(36).substring(7)
        const secondRandomString = Math.random().toString(36).substring(9)

        const { get: getSimpleState, set: setSimpleState } = (new StateHandler<string>(firstRandomString)).getPair()
        setSimpleState(firstRandomString)
        expect(getSimpleState()).toBe(firstRandomString);

        setSimpleState(secondRandomString)
        expect(getSimpleState()).toBe(secondRandomString);
    })

    it("should allow multiple declarations withing same block", () => {

        const data = {
            first: {
                string1: 'first.string1',
                string2: 'first.string2',
            },
            second: {
                string1: 'second.string1',
                string2: 'second.string2',
            }
        }

        const { get: getInstance1, set: setInstance1 } = (new StateHandler<string>(data.first.string1)).getPair()
        const { get: getInstance2, set: setInstance2 } = (new StateHandler<string>(data.second.string1)).getPair()

        // default read
        expect(getInstance1()).toBe(data.first.string1);
        expect(getInstance2()).toBe(data.second.string1);

        // updates
        setInstance1(data.first.string2)
        setInstance2(data.second.string2)

        // reads
        expect(getInstance1()).toBe(data.first.string2);
        expect(getInstance2()).toBe(data.second.string2);
    })

})
