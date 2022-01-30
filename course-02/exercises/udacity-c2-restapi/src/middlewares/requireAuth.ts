import { Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { NextFunction } from 'connect';
import { getConfiguration } from '../config/configurationProvider';


export async function requireAuth(req: Request, res: Response, next: NextFunction) {
    if (!req.headers || !req.headers.authorization) {
        return res.status(401).send({ message: 'No authorization headers.' });
    }


    if (!req.headers.authorization.startsWith('Bearer ')) {
        return res.status(401).send({ message: 'Malformed token.' });
    }

    const token = req.headers.authorization.split(' ')[1];
    const config = await getConfiguration();

    return jwt.verify(token, config.jwt.secret, (err, decoded) => {
        if (err) {
            return res.status(500).send({ auth: false, message: 'Failed to authenticate.' });
        }
        return next();
    });
}
