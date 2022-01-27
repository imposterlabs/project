import { MethodNotImplementedException } from "../exceptions/common/MethodNotImplementedException"

export const MethodNotImplemented = <ReturnType>(methodName: string): ReturnType => {
    throw new MethodNotImplementedException(methodName)
}
