import { Router, Request, Response } from 'express';
import { FeedItem } from '../models/FeedItem';
import { requireAuth } from '../../../../middlewares/requireAuth';
import * as AWS from '../../../../aws';

const router: Router = Router();

// Get all feed items
router.get('/', async (req: Request, res: Response) => {
    const items = await FeedItem.findAndCountAll({order: [['id', 'DESC']]});
    items.rows.map(async (item) => {
            if (item.url) {
                item.url = await AWS.getGetSignedUrl(item.url);
            }
    });
    res.send(items);
});

// Get feed by primary key
router.get('/:id',
    requireAuth,
    async function getFeedByPk(req: Request, res: Response) {
        const id = req.params['id'];
        const feed = await FeedItem.findByPk(id);

        if (!feed) {
            return res.send(404);
        }
        return res.status(200).send(feed);

    });

// update a specific resource
router.patch('/:id',
    requireAuth,
    async function updateFeed(req: Request, res: Response) {
        const id = req.params['id'];
        const feed = await FeedItem.findByPk(id);

        if (!feed) {
            return res.status(400).send('Feed with such id not exist!');
        }

        feed.caption = req.body.caption;
        feed.url = req.body.url;
        feed.save();

        res.send(200);
});


// Get a signed url to put a new item in the bucket
router.get('/signed-url/:fileName',
    requireAuth,
    async (req: Request, res: Response) => {
    const { fileName } = req.params;
    const url = await AWS.getPutSignedUrl(fileName);
    res.status(201).send({url: url});
});

// Post meta data and the filename after a file is uploaded
// NOTE the file name is they key name in the s3 bucket.
// body : {caption: string, fileName: string};
router.post('/',
    requireAuth,
    async (req: Request, res: Response) => {
    const caption = req.body.caption;
    const fileName = req.body.url;

    // check Caption is valid
    if (!caption) {
        return res.status(400).send({ message: 'Caption is required or malformed' });
    }

    // check Filename is valid
    if (!fileName) {
        return res.status(400).send({ message: 'File url is required' });
    }

    const item = await new FeedItem({
            caption: caption,
            url: fileName
    });

    const saved_item = await item.save();

    saved_item.url = await AWS.getGetSignedUrl(saved_item.url);
    res.status(201).send(saved_item);
});

export const FeedRouter: Router = router;
