import express from 'express';
import {
  shortenUrl,
  redirectUrl,
  getUrlStats
} from '../controllers/url.controller.js';

const router = express.Router();


router.route('/shorten').post(shortenUrl);





router.route('/stats/:code').get(getUrlStats);





router.route('/:code').get(redirectUrl);





export default router;

