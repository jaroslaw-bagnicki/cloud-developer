import { Router, Request, Response } from 'express';
import { requireAuth } from '../../../../middlewares/requireAuth';

import { User } from '../models/User';
import { AuthRouter } from './auth.router';

const router: Router = Router();

router.use('/auth', AuthRouter);

router.get('/', requireAuth, async (req: Request, res: Response) => {
});

router.get('/:id', requireAuth, async (req: Request, res: Response) => {
    const { id } = req.params;
    const item = await User.findByPk(id);
    res.send(item);
});

export const UserRouter: Router = router;
