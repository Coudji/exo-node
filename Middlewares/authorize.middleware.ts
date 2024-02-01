import { NextFunction, RequestHandler, Response, Request } from "express";
import { getById } from "../Database/utils";

export function createAuthorizeMiddleWare(roles: string[]): RequestHandler {
    return async (request: Request, response: Response, next: NextFunction) => {
        if (!request.query.userId) {
            return response.status(403).send("Forbidden");
        }
        const user = await getById('users', request.query.userId as string);
        if (!user) {
            return response.status(403).send("Forbidden");
        }
        if (roles.length > 0 && !roles.includes(user.role)) {
            return response.status(403).send("Forbidden");
        }

        next();
    }
}