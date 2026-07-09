import { ADMIN, MEMBER } from '@/constants/role';
import { SessionUser } from '@/types/session.type';
import { CreateUpdatePackageFormValues } from '@/validations/admin/create-update-package';
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
      },
    ],
    total: 1,
  }),
);

const mockCreate = mock((payload: CreateUpdatePackageFormValues) =>
  Promise.resolve({
    id: 1,
    name: payload.name,
    description: payload.description,
    price: payload.price,
    isActive: payload.isActive ?? true,
    isPopular: payload.isPopular ?? false,
    createdAt: new Date(),
    updatedAt: new Date(),
  }),
);

mock.module('@/services/package.service', () => ({
  packageService: {
    getAll: mockGetAll,
    create: mockCreate,
  },
}));

describe('GET /api/package (Get All Packages)', () => {
  beforeEach(() => {
    mockGetAll.mockClear();
    mockSession = null;
  });

  it('admin role can get all packages', async () => {
    mockSession = { user: { id: 1, email: 'admin@wevin.com', role: ADMIN } };
    const request = new NextRequest(
      'http://localhost/api/package?page=1&limit=10',
    );
    const response = await GET(request);

    const body = await response.json();
    expect(response.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.message).toBe('Packages fetched successfully');
    expect(body.data.items).toHaveLength(1);
    expect(body.data.items[0].name).toBe('Premium');

    expect(mockGetAll).toHaveBeenCalledWith({
      search: undefined,
      isActive: undefined,
      isPopular: undefined,
      page: 1,
      limit: 10,
    });
  });

  it('member role cannot get all packages', async () => {
    mockSession = {
      user: { id: 2, email: 'member@wevin.com', role: MEMBER },
    };
    const request = new NextRequest(
      'http://localhost/api/package?page=1&limit=10',
    );
    const response = await GET(request);

    const body = await response.json();
    expect(response.status).toBe(403);
    expect(body.success).toBe(false);
    expect(body.message).toBe('Forbidden');
    expect(mockGetAll).not.toHaveBeenCalled();
  });

  it('guest cannot get all packages', async () => {
    mockSession = null;
    const request = new NextRequest(
      'http://localhost/api/package?page=1&limit=10',
    );
    const response = await GET(request);

    const body = await response.json();
    expect(response.status).toBe(401);
    expect(body.success).toBe(false);
    expect(body.message).toBe('Unauthorized');
    expect(mockGetAll).not.toHaveBeenCalled();
  });
});

describe('POST /api/package (Create Package)', () => {
  beforeEach(() => {
    mockCreate.mockClear();
    mockSession = null;
  });

  const validPayload: CreateUpdatePackageFormValues = {
    name: 'Standard Package',
    description: 'A standard wedding package',
    price: 50000,
    isActive: true,
    isPopular: false,
    benefits: [
      {
        benefitKey: 'photo_limit',
        quotaValue: 5,
      },
    ],
    templateIds: [1, 2],
  };

  it('admin role can create package', async () => {
    mockSession = { user: { id: 1, email: 'admin@wevin.com', role: ADMIN } };
    const request = new NextRequest('http://localhost/api/package', {
      method: 'POST',
      body: JSON.stringify(validPayload),
    });

    const response = await POST(request);
    const body = await response.json();
    expect(response.status).toBe(201);
    expect(body.success).toBe(true);
    expect(body.message).toBe('Package created successfully');
    expect(mockCreate).toHaveBeenCalledWith(validPayload, mockSession.user.id);
  });

  it('member role cannot create package', async () => {
    mockSession = { user: { id: 2, email: 'member@wevin.com', role: MEMBER } };

    const request = new NextRequest('http://localhost/api/package', {
      method: 'POST',
      body: JSON.stringify(validPayload),
    });

    const response = await POST(request);
    const body = await response.json();
    expect(response.status).toBe(403);
    expect(body.success).toBe(false);
    expect(body.message).toBe('Forbidden');
    expect(mockCreate).not.toHaveBeenCalled();
  });

  it('guest cannot create package', async () => {
    mockSession = null;
    const request = new NextRequest('http://localhost/api/package', {
      method: 'POST',
      body: JSON.stringify(validPayload),
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

    const request = new NextRequest('http://localhost/api/package', {
      method: 'POST',
      body: JSON.stringify({
        name: 'St',
        description: '',
        price: -100,
        benefits: [],
        templateIds: [],
      }),
    });

    const response = await POST(request);
    const body = await response.json();
    expect(response.status).toBe(400);
    expect(body.success).toBe(false);
    expect(body.message).toBe('Validation failed');
    expect(body.errors).toBeDefined();
    expect(mockCreate).not.toHaveBeenCalled();
  });
});
