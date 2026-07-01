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

const mockPackageData = {
  id: 1,
  name: 'Premium',
  description: 'Premium package',
  price: 100000,
  isActive: true,
  isPopular: false,
  benefits: [
    {
      id: 1,
      benefitKey: 'photo_limit',
      toggleValue: null,
      quotaValue: 10,
    },
  ],
  templates: [
    {
      id: 1,
      packageId: 1,
      templateId: 1,
      template: {
        id: 1,
        name: 'Rustic Theme',
      },
    },
  ],
  members: [
    {
      id: 1,
      userId: 1,
      packageId: 1,
      user: {
        id: 1,
        name: 'John Doe',
      },
    },
  ],
};

const mockGetWithRelationships = mock(() => Promise.resolve(mockPackageData));

mock.module('@/services/package.service', () => ({
  packageService: {
    getWithRelationships: mockGetWithRelationships,
  },
}));

describe('GET /api/package/edit/[id] (Get Package With Relationships)', () => {
  beforeEach(() => {
    mockGetWithRelationships.mockClear();
    mockSession = null;
  });

  it('admin role can get package with relationships', async () => {
    mockSession = { user: { id: 1, email: 'admin@wevin.com', role: ADMIN } };
    const request = new NextRequest(
      `http://localhost/api/package/edit/${mockPackageData.id}`,
    );
    const response = await GET(request, {
      params: Promise.resolve({ id: mockPackageData.id.toString() }),
    });

    const body = await response.json();
    expect(response.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.message).toBe('Package fetched successfully');
    expect(body.data).toEqual(mockPackageData);
    expect(mockGetWithRelationships).toHaveBeenCalledWith(mockPackageData.id);
  });

  it('member role cannot get package with relationships', async () => {
    mockSession = {
      user: { id: 2, email: 'member@wevin.com', role: MEMBER },
    };
    const request = new NextRequest(
      `http://localhost/api/package/edit/${mockPackageData.id}`,
    );
    const response = await GET(request, {
      params: Promise.resolve({ id: mockPackageData.id.toString() }),
    });

    const body = await response.json();
    expect(response.status).toBe(403);
    expect(body.success).toBe(false);
    expect(body.message).toBe('Forbidden');
    expect(mockGetWithRelationships).not.toHaveBeenCalled();
  });

  it('guest cannot get package with relationships', async () => {
    mockSession = null;
    const request = new NextRequest(
      `http://localhost/api/package/edit/${mockPackageData.id}`,
    );
    const response = await GET(request, {
      params: Promise.resolve({ id: mockPackageData.id.toString() }),
    });

    const body = await response.json();
    expect(response.status).toBe(401);
    expect(body.success).toBe(false);
    expect(body.message).toBe('Unauthorized');
    expect(mockGetWithRelationships).not.toHaveBeenCalled();
  });

  it('returns 400 if ID is invalid', async () => {
    mockSession = { user: { id: 1, email: 'admin@wevin.com', role: ADMIN } };

    const request = new NextRequest('http://localhost/api/package/abc');
    const response = await GET(request, {
      params: Promise.resolve({ id: 'abc' }),
    });

    const body = await response.json();
    expect(response.status).toBe(400);
    expect(body.success).toBe(false);
    expect(body.message).toBe('Invalid ID');

    expect(mockGetWithRelationships).not.toHaveBeenCalled();
  });
});
