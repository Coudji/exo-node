import { Request, Response, NextFunction } from "express";
import { EntityNotFoundError } from "../Errors/entity-not-found.error";
import { NotFoundError } from "../Errors/not-found.error";

export function notFoundErrorHandler(
    error: Error,
    request: Request,
    response: Response,
    next: NextFunction
) {
    response.status(404);
    if (error instanceof EntityNotFoundError) {
        response.send('404 Entity Not Found');
    }
    if (error instanceof NotFoundError) {
        response.send('404 Not found');
    }
}