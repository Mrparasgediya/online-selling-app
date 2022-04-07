export const runMiddleware = (req, res, middleware) => {
  return new Promise((resolve, reject) => {
    middleware(req, res, (result) => {
      if (result instanceof Error) reject(result);
      resolve(result);
    });
  });
};
