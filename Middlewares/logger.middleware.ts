import { NextFunction, Request, Response } from "express";
import { appendFile } from "fs/promises";


function getUserIdOrDefault(request: Request) {
    if (request.query.userId) {
        return request.query.userId;
    }
    return "anonymous";
}

export async function loggerMiddleware(
    request: Request,
    response: Response,
    next: NextFunction, 
) {
    const today = new Date();
    const uploadPath = `./Logs/${today.toDateString()}.log`;
    const logContent = `${today.getHours()}-${today.getMinutes()} : ${request.method} ${request.path} ${getUserIdOrDefault(request)}\n`;
    await appendFile(uploadPath, logContent);

    next();
}