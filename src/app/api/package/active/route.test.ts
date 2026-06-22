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

const mockPackageActiveWithBenefitsData = {
  id: 1,
  name: 'Premium',
  price: 100000,
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
};

const mockGetActivePackage = mock(() =>
  Promise.resolve(mockPackageActiveWithBenefitsData),
);

mock.module('@/services/package.service', () => ({
  packageService: {
    getActiveWithBenefits: mockGetActivePackage,
  },
}));

describe('GET /api/package/active (Get Active Package With Benefits)', () => {
  beforeEach(() => {
    mockGetActivePackage.mockClear();
    mockSession = null;
  });

  it('admin role can get package active with benefits', async () => {
    mockSession = { user: { id: 1, email: 'admin@wevin.com', role: ADMIN } };
    const request = new NextRequest('http://localhost/api/package/active');
    const response = await GET(request);

    const body = await response.json();
    expect(response.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.message).toBe('Active packages fetched successfully');
    expect(body.data).toEqual(mockPackageActiveWithBenefitsData);
    expect(mockGetActivePackage).toHaveBeenCalledWith();
  });

  it('member role cannot get package active with benefits', async () => {
    mockSession = {
      user: { id: 2, email: 'member@wevin.com', role: MEMBER },
    };
    const request = new NextRequest('http://localhost/api/package/active');
    const response = await GET(request);

    const body = await response.json();
    expect(response.status).toBe(403);
    expect(body.success).toBe(false);
    expect(body.message).toBe('Forbidden');
    expect(mockGetActivePackage).not.toHaveBeenCalled();
  });

  it('guest cannot get package active with benefits', async () => {
    mockSession = null;
    const request = new NextRequest('http://localhost/api/package/active');
    const response = await GET(request);

    const body = await response.json();
    expect(response.status).toBe(401);
    expect(body.success).toBe(false);
    expect(body.message).toBe('Unauthorized');
    expect(mockGetActivePackage).not.toHaveBeenCalled();
  });
});
