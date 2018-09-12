export function joinPath(...paths: string[]): string {
    return paths.reduce((path, chunk) => {
        if (path.length > 0) {
            return (path.endsWith("/") ? path : path + "/") + (chunk.startsWith("/") ? chunk.slice(1, chunk.length) : chunk)
        } else return chunk
    },"")
}