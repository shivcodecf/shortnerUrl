import express from 'express';
import {
  shortenUrl,
  redirectUrl,
  getUrlStats,
  getAlluserUrls
} from '../controllers/url.controller.js';

import authMiddleware from '../middlewares/authmiddleware.js';

const router = express.Router();


router.route('/shorten').post(authMiddleware, shortenUrl);


router.route('/getAll').get(authMiddleware, getAlluserUrls);


router.route('/stats/:code').get(authMiddleware, getUrlStats);











router.route('/:code').get(authMiddleware, redirectUrl);





export default router;

