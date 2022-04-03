export function checkIsValidPayload(keysToCheck: string[], validKeys: string[], checkAllKeys: boolean = true) {
    return !checkAllKeys ? validKeys.some(key => keysToCheck.includes(key)) : validKeys.every(key => keysToCheck.includes(key))
}
export function setDataToObj(obj: any, body: any, validKeys: string[]) {
    for (let key of validKeys) {
        if (body[key])
            obj[key] = body[key];
    }
    return obj;
}