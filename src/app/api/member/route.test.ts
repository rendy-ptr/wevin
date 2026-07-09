import { ADMIN, MEMBER } from '@/constants/role';
import { SessionUser } from '@/types/session.type';
import { CreateUpdateMemberFormValues } from '@/validations/admin/create-update-member';
import { beforeEach, describe, expect, it, mock } from 'bun:test';
import { NextRequest } from 'next/server';
import { GET, POST } from './route';

let mockSession: { user: Pick<SessionUser, 'id' | 'email' | 'role'> } | null =
  null;

mock.module('@/lib/auth', () => ({
  getSession: () => Promise.resolve(mockSession),
}));

const mockGetAll = mock(() =>
  Promise.resolve({
    items: [
      {
        id: 1,
        name: 'Budi Santoso',
        email: 'budi@example.com',
        status: 'active',
      },
    ],
    total: 1,
  }),
);

const mockCreate = mock((payload: CreateUpdateMemberFormValues) =>
  Promise.resolve({
    id: 2,
    name: payload.name,
    email: payload.email,
  }),
);

mock.module('@/services/member.service', () => ({
  memberService: {
    getAll: mockGetAll,
    create: mockCreate,
  },
}));

describe('GET /api/member (Get All Members)', () => {
  beforeEach(() => {
    mockGetAll.mockClear();
    mockSession = null;
  });

  it('admin role can get all members', async () => {
    mockSession = { user: { id: 1, email: 'admin@wevin.com', role: ADMIN } };
    const request = new NextRequest(
      'http://localhost/api/member?page=1&limit=10',
    );
    const response = await GET(request);

    const body = await response.json();
    expect(response.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.message).toBe('Members fetched successfully');
    expect(body.data.items).toHaveLength(1);
    expect(body.data.items[0].name).toBe('Budi Santoso');

    expect(mockGetAll).toHaveBeenCalledWith({
      search: undefined,
      packageId: undefined,
      status: undefined,
      page: 1,
      limit: 10,
    });
  });

  it('member role cannot get all members', async () => {
    mockSession = {
      user: { id: 2, email: 'member@wevin.com', role: MEMBER },
    };
    const request = new NextRequest(
      'http://localhost/api/member?page=1&limit=10',
    );
    const response = await GET(request);

    const body = await response.json();
    expect(response.status).toBe(403);
    expect(body.success).toBe(false);
    expect(body.message).toBe('Forbidden');
    expect(mockGetAll).not.toHaveBeenCalled();
  });

  it('guest cannot get all members', async () => {
    mockSession = null;
    const request = new NextRequest(
      'http://localhost/api/member?page=1&limit=10',
    );
    const response = await GET(request);

    const body = await response.json();
    expect(response.status).toBe(401);
    expect(body.success).toBe(false);
    expect(body.message).toBe('Unauthorized');
    expect(mockGetAll).not.toHaveBeenCalled();
  });
});

describe('POST /api/member (Create Member)', () => {
  beforeEach(() => {
    mockCreate.mockClear();
    mockSession = null;
  });

  it('admin role can create member', async () => {
    mockSession = { user: { id: 1, email: 'admin@wevin.com', role: ADMIN } };
    const request = new NextRequest('http://localhost/api/member', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Asep Saepudin',
        email: 'asep@example.com',
        packageId: 1,
      }),
    });

    const response = await POST(request);
    const body = await response.json();
    expect(response.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.message).toBe('Member created successfully');
    expect(mockCreate).toHaveBeenCalledWith(
      {
        name: 'Asep Saepudin',
        email: 'asep@example.com',
        packageId: 1,
      },
      mockSession.user.id,
    );
  });

  it('member role cannot create member', async () => {
    mockSession = { user: { id: 2, email: 'member@wevin.com', role: MEMBER } };

    const request = new NextRequest('http://localhost/api/member', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Asep Saepudin',
        email: 'asep@example.com',
        packageId: 1,
      }),
    });

    const response = await POST(request);
    const body = await response.json();
    expect(response.status).toBe(403);
    expect(body.success).toBe(false);
    expect(body.message).toBe('Forbidden');
    expect(mockCreate).not.toHaveBeenCalled();
  });

  it('guest cannot create member', async () => {
    mockSession = null;
    const request = new NextRequest('http://localhost/api/member', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Asep Saepudin',
        email: 'asep@example.com',
        packageId: 1,
      }),
    });

    const response = await POST(request);
    const body = await response.json();
    expect(response.status).toBe(401);
    expect(body.success).toBe(false);
    expect(body.message).toBe('Unauthorized');
    expect(mockCreate).not.toHaveBeenCalled();
  });

  it('validation failed if data body is invalid schema', async () => {
    mockSession = { user: { id: 99, email: 'admin@wevin.com', role: ADMIN } };

    const request = new NextRequest('http://localhost/api/member', {
      method: 'POST',
      body: JSON.stringify({
        name: 'As',
        email: 'invalid-email',
        packageId: -1,
      }),
    });

    const response = await POST(request);
    const body = await response.json();
    expect(response.status).toBe(400);
    expect(body.success).toBe(false);
    expect(body.message).toBe('Validation failed');
    expect(body.data).toBeUndefined();
    expect(body.errors).toBeDefined();
    expect(mockCreate).not.toHaveBeenCalled();
  });
});
