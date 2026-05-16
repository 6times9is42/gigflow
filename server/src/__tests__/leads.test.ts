import request from 'supertest';
import app from '../app';
import { connectTestDB, disconnectTestDB, clearTestDB } from './helpers/db';
import { registerUser } from './helpers/auth';

beforeAll(connectTestDB);
afterAll(disconnectTestDB);
afterEach(clearTestDB);

const LEAD_PAYLOAD = {
  name: 'Bob Client',
  email: 'bob@client.com',
  status: 'New',
  source: 'Website',
};

describe('POST /api/leads', () => {
  it('creates a lead and returns 201', async () => {
    const { token } = await registerUser('Alice', 'alice@test.com', 'Password123');

    const res = await request(app)
      .post('/api/leads')
      .set('Authorization', `Bearer ${token}`)
      .send(LEAD_PAYLOAD);

    expect(res.status).toBe(201);
    expect(res.body.data).toMatchObject({
      name: 'Bob Client',
      email: 'bob@client.com',
      status: 'New',
      source: 'Website',
    });
    expect(res.body.data).not.toHaveProperty('__v');
  });

  it('returns 401 when unauthenticated', async () => {
    const res = await request(app).post('/api/leads').send(LEAD_PAYLOAD);
    expect(res.status).toBe(401);
  });

  it('returns 400 when required field is missing', async () => {
    const { token } = await registerUser('Alice', 'alice@test.com', 'Password123');
    const { source: _omitted, ...noSource } = LEAD_PAYLOAD;

    const res = await request(app)
      .post('/api/leads')
      .set('Authorization', `Bearer ${token}`)
      .send(noSource);

    expect(res.status).toBe(400);
  });
});

describe('GET /api/leads', () => {
  it('returns paginated leads for authenticated user', async () => {
    const { token } = await registerUser('Alice', 'alice@test.com', 'Password123');

    await request(app)
      .post('/api/leads')
      .set('Authorization', `Bearer ${token}`)
      .send(LEAD_PAYLOAD);

    const res = await request(app)
      .get('/api/leads')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.pagination).toMatchObject({
      page: 1,
      total: 1,
      totalPages: 1,
      hasNext: false,
      hasPrev: false,
    });
  });

  it('filters leads by search query', async () => {
    const { token } = await registerUser('Alice', 'alice@test.com', 'Password123');

    await request(app)
      .post('/api/leads')
      .set('Authorization', `Bearer ${token}`)
      .send(LEAD_PAYLOAD);

    await request(app)
      .post('/api/leads')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Carol Other', email: 'carol@other.com', status: 'New', source: 'Referral' });

    const res = await request(app)
      .get('/api/leads?search=Bob')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
    expect((res.body.data as Array<{ name: string }>)[0]?.name).toBe('Bob Client');
  });
});

describe('GET /api/leads/:id', () => {
  it('returns the lead when owner requests it', async () => {
    const { token } = await registerUser('Alice', 'alice@test.com', 'Password123');

    const createRes = await request(app)
      .post('/api/leads')
      .set('Authorization', `Bearer ${token}`)
      .send(LEAD_PAYLOAD);

    const id = (createRes.body as { data: { _id: string } }).data._id;

    const res = await request(app)
      .get(`/api/leads/${id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.data._id).toBe(id);
  });

  it("returns 403 when a sales user requests another user's lead", async () => {
    const alice = await registerUser('Alice', 'alice@test.com', 'Password123');
    const bob = await registerUser('Bob', 'bob@test.com', 'Password123');

    const createRes = await request(app)
      .post('/api/leads')
      .set('Authorization', `Bearer ${alice.token}`)
      .send(LEAD_PAYLOAD);

    const id = (createRes.body as { data: { _id: string } }).data._id;

    const res = await request(app)
      .get(`/api/leads/${id}`)
      .set('Authorization', `Bearer ${bob.token}`);

    expect(res.status).toBe(403);
  });

  it('returns 400 for a malformed ObjectId', async () => {
    const { token } = await registerUser('Alice', 'alice@test.com', 'Password123');

    const res = await request(app)
      .get('/api/leads/not-a-valid-id')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(400);
  });
});

describe('PUT /api/leads/:id', () => {
  it('updates a lead when the owner requests it', async () => {
    const { token } = await registerUser('Alice', 'alice@test.com', 'Password123');

    const createRes = await request(app)
      .post('/api/leads')
      .set('Authorization', `Bearer ${token}`)
      .send(LEAD_PAYLOAD);

    const id = (createRes.body as { data: { _id: string } }).data._id;

    const res = await request(app)
      .put(`/api/leads/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ status: 'Contacted' });

    expect(res.status).toBe(200);
    expect(res.body.data.status).toBe('Contacted');
  });

  it("returns 403 when a sales user tries to update another user's lead", async () => {
    const alice = await registerUser('Alice', 'alice@test.com', 'Password123');
    const bob = await registerUser('Bob', 'bob@test.com', 'Password123');

    const createRes = await request(app)
      .post('/api/leads')
      .set('Authorization', `Bearer ${alice.token}`)
      .send(LEAD_PAYLOAD);

    const id = (createRes.body as { data: { _id: string } }).data._id;

    const res = await request(app)
      .put(`/api/leads/${id}`)
      .set('Authorization', `Bearer ${bob.token}`)
      .send({ status: 'Qualified' });

    expect(res.status).toBe(403);
  });
});

describe('DELETE /api/leads/:id', () => {
  it('deletes a lead and returns 200', async () => {
    const { token } = await registerUser('Alice', 'alice@test.com', 'Password123');

    const createRes = await request(app)
      .post('/api/leads')
      .set('Authorization', `Bearer ${token}`)
      .send(LEAD_PAYLOAD);

    const id = (createRes.body as { data: { _id: string } }).data._id;

    const deleteRes = await request(app)
      .delete(`/api/leads/${id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(deleteRes.status).toBe(200);

    const getRes = await request(app)
      .get(`/api/leads/${id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(getRes.status).toBe(404);
  });
});
