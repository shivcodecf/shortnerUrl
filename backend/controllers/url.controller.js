import { nanoid } from 'nanoid';
import Url from '../models/url.model.js';
import validUrl from 'valid-url';


const normalizeUrl = (url) => {
  if (!/^https?:\/\//i.test(url)) {
    return `https://${url}`;
  }
  return url;
};


export const shortenUrl = async (req, res) => {
  let { originalUrl, longUrl } = req.body;
  originalUrl = originalUrl || longUrl;

  console.log("Incoming body:", req.body); // 👈 Add this

  if (!originalUrl) {
    return res.status(400).json({ error: 'Original URL is required' });
  }

  originalUrl = normalizeUrl(originalUrl);

  
  if (!validUrl.isWebUri(originalUrl)) {
    return res.status(400).json({ error: 'Enter a valid URL' });
  }

  try {
    
    let existing = await Url.findOne({ originalUrl });
    if (existing) {
      return res.status(200).json({
        shortUrl: `${process.env.BASE_URL}/${existing.shortId}`,
      });
    }

    
    const shortId = nanoid(6);
    const newUrl = new Url({ originalUrl, shortId });
    await newUrl.save();

    const shortUrl = `${process.env.BASE_URL}/${shortId}`;
    res.status(201).json({ shortUrl });
  } catch (err) {
    console.error('Error creating short URL:', err);
    res.status(500).json({ error: 'Server error while shortening URL' });
  }
};




export const getUrlStats = async (req, res) => {
  
    const { code } = req.params;

  try {
    

    const url = await Url.findOne({ shortId: code });

    if (!url) {
      return res.status(404).json({ error: 'Short URL not found' });
    }

    const shortUrl = `${req.protocol}://${req.get("host")}/${url.shortId}`;

    res.status(201).json({
  shortUrl, 
  originalUrl: url.originalUrl,
  clickCount: url.clickCount,
  createdAt: url.createdAt,
  clicks: url.clicks
});
  } catch (err) {
    console.error('Stats fetch error:', err);
    res.status(500).json({ error: 'Server error fetching stats' });
  }
};


export const redirectUrl = async (req, res) => {
  

  try {

    const { code } = req.params;


    const url = await Url.findOne({ shortId: code });

    if (!url) {
      return res.status(404).json({ error: 'Short URL not found' });
    }


    url.clicks.push({ ip: req.ip });
    
    await url.save();


    return res.redirect(url.originalUrl);
  } catch (err) {
    console.error('Redirect error:', err);
    res.status(500).json({ error: 'Server error during redirect' });
  }
};



