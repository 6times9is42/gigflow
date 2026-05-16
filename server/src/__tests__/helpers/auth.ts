import request from 'supertest';
import app from '../../app';

interface RegisteredUser {
  token: string;
  userId: string;
}

export async function registerUser(
  name: string,
  email: string,
  password: string,
): Promise<RegisteredUser> {
  const res = await request(app)
    .post('/api/auth/register')
    .send({ name, email, password });

  if (res.status !== 201) {
    throw new Error(`registerUser failed: ${JSON.stringify(res.body)}`);
  }

  const body = res.body as { data: { user: { id: string }; token: string } };
  return { token: body.data.token, userId: body.data.user.id };
}
