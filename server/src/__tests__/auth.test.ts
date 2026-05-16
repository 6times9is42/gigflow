import request from 'supertest';
import app from '../app';
import { connectTestDB, disconnectTestDB, clearTestDB } from './helpers/db';

beforeAll(connectTestDB);
afterAll(disconnectTestDB);
afterEach(clearTestDB);

const VALID_USER = {
  name: 'Alice Test',
  email: 'alice@example.com',
  password: 'Password123',
};

describe('POST /api/auth/register', () => {
  it('creates a user and returns 201 with token', async () => {
    const res = await request(app).post('/api/auth/register').send(VALID_USER);

    expect(res.status).toBe(201);
    expect(res.body.data).toMatchObject({
      user: { name: 'Alice Test', email: 'alice@example.com', role: 'sales' },
    });
    expect(typeof res.body.data.token).toBe('string');
    expect(res.body.data.user).not.toHaveProperty('password');
  });

  it('returns 409 when email is already registered', async () => {
    await request(app).post('/api/auth/register').send(VALID_USER);
    const res = await request(app).post('/api/auth/register').send(VALID_USER);

    expect(res.status).toBe(409);
    expect(res.body.error.code).toBe('DUPLICATE_EMAIL');
  });

  it('returns 400 when email is invalid', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ ...VALID_USER, email: 'not-an-email' });

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('returns 400 when password is too short', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ ...VALID_USER, password: 'short' });

    expect(res.status).toBe(400);
  });
});

describe('POST /api/auth/login', () => {
  beforeEach(async () => {
    await request(app).post('/api/auth/register').send(VALID_USER);
  });

  it('returns 200 with token on valid credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: VALID_USER.email, password: VALID_USER.password });

    expect(res.status).toBe(200);
    expect(typeof res.body.data.token).toBe('string');
    expect(res.body.data.user.email).toBe(VALID_USER.email);
  });

  it('returns 401 on wrong password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: VALID_USER.email, password: 'WrongPass999' });

    expect(res.status).toBe(401);
    expect(res.body.error.code).toBe('INVALID_CREDENTIALS');
  });

  it('returns 401 for non-existent email', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'nobody@example.com', password: 'Password123' });

    expect(res.status).toBe(401);
  });
});

describe('GET /api/auth/me', () => {
  it('returns the current user when authenticated', async () => {
    const regRes = await request(app).post('/api/auth/register').send(VALID_USER);
    const token = (regRes.body as { data: { token: string } }).data.token;

    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.data.email).toBe(VALID_USER.email);
  });

  it('returns 401 when no token is provided', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.status).toBe(401);
  });
});
