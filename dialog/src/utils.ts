import * as crypto from "crypto";

/**
 * Generates random alphanumerical char sequence of "length" size.
 * 
 * @param {*} length # of characters generated
 * @returns randomized string
 */
export function randomStr(length: number): string {
    var res = ""
    if (length < 120) {
        res = (crypto.randomBytes(length).toString("base64")).slice(0, length);
    } else {
        console.error("to long length to use random algorithm")
    }
    return res
}

/** With this API url */
export const withHost = (uri: string) => { 
    let host = process.env.HOST_PUBLIC_ADDRESS.endsWith("/") ? process.env.HOST_PUBLIC_ADDRESS : process.env.HOST_PUBLIC_ADDRESS + "/";
    let resource = uri.startsWith("/") ? uri.slice(1, uri.length) : uri;
    return host + resource;
}

export const withSlash = (p: string): string => p.endsWith("/") ? p : p + "/";

export function joinPath(...paths: string[]): string {
    return paths.reduce((path, chunk) => {
        if (path.length > 0) {
            return (path.endsWith("/") ? path : path + "/") + (chunk.startsWith("/") ? chunk.slice(1, chunk.length) : chunk)
        } else return chunk
    },"")
}

/**  Repeat <times> times symbol <str> and return a string */
export const repeat = (str: string, times: number): string => (Array(times).fill(str)).reduce((s, part) => s + part, '');