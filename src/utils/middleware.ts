export const runMiddleware = (req, res, middlreware) => {
    return new Promise((resolve, reject) => {
        middlreware(req, res, result => {
            if (result instanceof Error)
                reject(result);
            resolve(result);
        })
    })
}

