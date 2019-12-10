import { Md5 } from "md5-typescript";

const PUBLIC_KEY = "c702d9a5fd7a4986452659dfa7f28259"
const PRIVATE_KEY = "c9638037240ea92bd48fd60005f809e3fc30b0c7"

export class AuthHelper {
    constructor() { }

    public static getAuthParameters(): string {
        let ts = new Date().getTime()
        let hash = Md5.init(`${ts}${PRIVATE_KEY}${PUBLIC_KEY}`)
        let auth = `&ts=${ts}&apikey=${PUBLIC_KEY}&hash=${hash}`

        return auth
    }
}