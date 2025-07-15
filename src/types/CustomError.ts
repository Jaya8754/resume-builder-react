export type CustomError = Error & {
    statusCode: number,
    timestamp: string,
    path: string,
    message: string,
    errors: null | {[key: string]: any}
};