import request from 'supertest';
import app from '../app.js';
import mongoose from 'mongoose';
import Url from '../models/url.model.js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.test' }); // load test env

beforeAll(async () => {
  
  await mongoose.connect(process.env.TEST_MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,

  });
  
});


beforeEach(async () => {
  await Url.deleteMany({});
});


afterEach(async () => {
  await Url.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('POST /shorten', () => {
  it('should return 400 if no URL is provided', async () => {
    const res = await request(app).post('/shorten').send({});
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  it('should create a new short URL', async () => {
    const res = await request(app).post('/shorten').send({
      originalUrl: 'https://example.com',
    });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('shortUrl');
    expect(res.body.shortUrl).toMatch(/^https?:\/\/.+/);
  });
});
