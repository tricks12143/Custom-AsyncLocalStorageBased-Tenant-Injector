import {randomUUID} from 'crypto';
import { NextFunction, Request, Response } from 'express';
const {als} = require('../utils/context');

export const alsMiddleWare = async (req: Request, res: Response, next: NextFunction) => {
    const reqId = randomUUID();
    als.run({reqId}, () => {
        next();
    });
}