import { Request, Response, NextFunction } from "express";

export function internalServerErrorHandler(
    error: Error,
    request: Request,
    response: Response,
    next: NextFunction
) {
    response.status(500);
    response.send(`500 Internal Server Error`);
}