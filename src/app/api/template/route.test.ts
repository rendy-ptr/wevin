import { ADMIN, MEMBER } from '@/constants/role';
import { SessionUser } from '@/types/session.type';
import { beforeEach, describe, expect, it, mock } from 'bun:test';
import { NextRequest } from 'next/server';
import { GET } from './route';

let mockSession: { user: Pick<SessionUser, 'id' | 'email' | 'role'> } | null =
  null;

mock.module('@/lib/auth', () => ({
  getSession: () => Promise.resolve(mockSession),
}));

const mockGetAll = mock(() =>
  Promise.resolve({
    id: 1,
    key: 'template-key',
    name: 'Template Name',
    thumbnail: 'template-thumbnail',
  }),
);

mock.module('@/services/template.service', () => ({
  templateService: {
    getAll: mockGetAll,
  },
}));

describe('GET /api/template (Get All Templates)', () => {
  beforeEach(() => {
    mockGetAll.mockClear();
    mockSession = null;
  });

  it('admin role can get all templates', async () => {
    mockSession = { user: { id: 1, email: 'admin@wevin.com', role: ADMIN } };
    const request = new NextRequest('http://localhost/api/template');
    const response = await GET(request);

    const body = await response.json();
    expect(response.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.message).toBe('Templates fetched successfully');
    expect(body.data).toEqual({
      id: 1,
      key: 'template-key',
      name: 'Template Name',
      thumbnail: 'template-thumbnail',
    });
    expect(mockGetAll).toHaveBeenCalledWith();
  });

  it('member role can get all templates', async () => {
    mockSession = {
      user: { id: 2, email: 'member@wevin.com', role: MEMBER },
    };
    const request = new NextRequest('http://localhost/api/template');
    const response = await GET(request);

    const body = await response.json();
    expect(response.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.message).toBe('Templates fetched successfully');
    expect(body.data).toEqual({
      id: 1,
      key: 'template-key',
      name: 'Template Name',
      thumbnail: 'template-thumbnail',
    });
    expect(mockGetAll).toHaveBeenCalled();
  });

  it('guest cannot get all templates', async () => {
    mockSession = null;
    const request = new NextRequest('http://localhost/api/template');
    const response = await GET(request);

    const body = await response.json();
    expect(response.status).toBe(401);
    expect(body.success).toBe(false);
    expect(body.message).toBe('Unauthorized');
    expect(mockGetAll).not.toHaveBeenCalled();
  });
});
