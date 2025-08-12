export type CustomError = Error & {
    statusCode: number,
    timestamp: string,
    path: string,
    message: string,
    // eslint-disable-next-line
    errors: null | {[key: string]: any} 
};