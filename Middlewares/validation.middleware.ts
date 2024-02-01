import { type NextFunction, type Request, type Response } from "express";
import { validationResult } from "express-validator";

export const ValidationMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const result = validationResult(req);

    const errors = result.array();

    if (errors.length > 0) {
        // bad request
        res.status(400);
        return res.send({
            errors
        });
    }

    // on passe à suite
    next();
}
