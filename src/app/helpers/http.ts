const EMPTY_STRING = ''

export class HTTPHelper {
    constructor() { }

    public static serializeParamsFromObject(params?: Object): string {
        debugger
        let entries: string = EMPTY_STRING

        if (params) {
            for (var [key, value] of Object.entries(params)) {
                entries += `&${key}=${value}`
            }
        }

        return entries
    }
}