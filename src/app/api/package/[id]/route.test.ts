import { ADMIN, MEMBER } from '@/constants/role';
import { SessionUser } from '@/types/session.type';
import { beforeEach, describe, expect, it, mock } from 'bun:test';
import { NextRequest } from 'next/server';
import { DELETE, PUT } from './route';

let mockSession: { user: Pick<SessionUser, 'id' | 'email' | 'role'> } | null =
  null;

mock.module('@/lib/auth', () => ({
  getSession: () => Promise.resolve(mockSession),
}));

const mockPackageUpdateData = {
  id: 1,
  name: 'Premium',
  description: 'Premium package',
  price: 100000,
  isActive: true,
  isPopular: true,
};

const mockUpdatePackage = mock(() => Promise.resolve(mockPackageUpdateData));

const mockDeletePackage = mock(() => Promise.resolve(mockPackageUpdateData));

mock.module('@/services/package.service', () => ({
  packageService: {
    update: mockUpdatePackage,
    delete: mockDeletePackage,
  },
}));

describe('PUT /api/package/[id] (Update Package)', () => {
  beforeEach(() => {
    mockUpdatePackage.mockClear();
    mockSession = null;
  });

  const payload = {
    id: 1,
    name: 'Premium',
    description: 'Premium package',
    price: 100000,
    isActive: true,
    isPopular: true,
    benefits: [
      {
        benefitKey: 'photo_limit',
        quotaValue: 10,
      },
    ],
    templateIds: [1, 2, 3],
  };

  it('admin role can update package', async () => {
    mockSession = { user: { id: 1, email: 'admin@wevin.com', role: ADMIN } };
    const request = new NextRequest(
      `http://localhost/api/package/${payload.id}`,
      {
        method: 'PUT',
        body: JSON.stringify(payload),
      },
    );
    const response = await PUT(request, {
      params: Promise.resolve({ id: payload.id.toString() }),
    });

    const body = await response.json();
    expect(response.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.message).toBe('Package updated successfully');
    expect(body.data).toEqual(mockPackageUpdateData);
    expect(mockUpdatePackage).toHaveBeenCalledWith(
      payload.id,
      {
        name: payload.name,
        description: payload.description,
        price: payload.price,
        isActive: payload.isActive,
        isPopular: payload.isPopular,
        benefits: payload.benefits,
        templateIds: payload.templateIds,
      },
      mockSession.user.id,
    );
  });

  it('member role cannot update package', async () => {
    mockSession = {
      user: { id: 2, email: 'member@wevin.com', role: MEMBER },
    };
    const request = new NextRequest(
      `http://localhost/api/package/${payload.id}`,
      {
        method: 'PUT',
        body: JSON.stringify(payload),
      },
    );
    const response = await PUT(request, {
      params: Promise.resolve({ id: payload.id.toString() }),
    });

    const body = await response.json();
    expect(response.status).toBe(403);
    expect(body.success).toBe(false);
    expect(body.message).toBe('Forbidden');
    expect(mockUpdatePackage).not.toHaveBeenCalled();
  });

  it('guest cannot update package', async () => {
    mockSession = null;
    const request = new NextRequest(
      `http://localhost/api/package/${payload.id}`,
      {
        method: 'PUT',
        body: JSON.stringify(payload),
      },
    );
    const response = await PUT(request, {
      params: Promise.resolve({ id: payload.id.toString() }),
    });

    const body = await response.json();
    expect(response.status).toBe(401);
    expect(body.success).toBe(false);
    expect(body.message).toBe('Unauthorized');
    expect(mockUpdatePackage).not.toHaveBeenCalled();
  });

  it('validation failed if data body is invalid schema', async () => {
    mockSession = { user: { id: 1, email: 'admin@wevin.com', role: ADMIN } };
    const invalidPayload = {
      ...payload,
      price: -1,
    };
    const request = new NextRequest(
      `http://localhost/api/package/${invalidPayload.id}`,
      {
        method: 'PUT',
        body: JSON.stringify(invalidPayload),
      },
    );
    const response = await PUT(request, {
      params: Promise.resolve({ id: invalidPayload.id.toString() }),
    });

    const body = await response.json();
    expect(response.status).toBe(400);
    expect(body.success).toBe(false);
    expect(body.message).toBe('Validation failed');
    expect(mockUpdatePackage).not.toHaveBeenCalled();
  });

  it('returns 400 if ID is invalid', async () => {
    mockSession = { user: { id: 1, email: 'admin@wevin.com', role: ADMIN } };

    const request = new NextRequest('http://localhost/api/package/abc');
    const response = await PUT(request, {
      params: Promise.resolve({ id: 'abc' }),
    });

    const body = await response.json();
    expect(response.status).toBe(400);
    expect(body.success).toBe(false);
    expect(body.message).toBe('Invalid ID');

    expect(mockUpdatePackage).not.toHaveBeenCalled();
  });
});

describe('DELETE /api/package/[id] (Delete Package)', () => {
  beforeEach(() => {
    mockDeletePackage.mockClear();
    mockSession = null;
  });

  const packageId = 1;

  it('admin role can delete package', async () => {
    mockSession = { user: { id: 1, email: 'admin@wevin.com', role: ADMIN } };
    const request = new NextRequest(
      `http://localhost/api/package/${packageId}`,
      {
        method: 'DELETE',
      },
    );
    const response = await DELETE(request, {
      params: Promise.resolve({ id: packageId.toString() }),
    });

    const body = await response.json();
    expect(response.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.message).toBe('Package deleted successfully');
    expect(mockDeletePackage).toHaveBeenCalledWith(
      packageId,
      mockSession.user.id,
    );
  });

  it('member role cannot delete package', async () => {
    mockSession = { user: { id: 1, email: 'member@wevin.com', role: MEMBER } };
    const request = new NextRequest(
      `http://localhost/api/package/${packageId}`,
      {
        method: 'DELETE',
      },
    );
    const response = await DELETE(request, {
      params: Promise.resolve({ id: packageId.toString() }),
    });

    const body = await response.json();
    expect(response.status).toBe(403);
    expect(body.success).toBe(false);
    expect(body.message).toBe('Forbidden');
    expect(mockDeletePackage).not.toHaveBeenCalled();
  });

  it('guest cannot delete package', async () => {
    mockSession = null;
    const request = new NextRequest(
      `http://localhost/api/package/${packageId}`,
      {
        method: 'DELETE',
      },
    );
    const response = await DELETE(request, {
      params: Promise.resolve({ id: packageId.toString() }),
    });

    const body = await response.json();
    expect(response.status).toBe(401);
    expect(body.success).toBe(false);
    expect(body.message).toBe('Unauthorized');
    expect(mockDeletePackage).not.toHaveBeenCalled();
  });

  it('returns 400 if ID is invalid', async () => {
    mockSession = { user: { id: 1, email: 'admin@wevin.com', role: ADMIN } };

    const request = new NextRequest('http://localhost/api/package/abc', {
      method: 'DELETE',
    });
    const response = await DELETE(request, {
      params: Promise.resolve({ id: 'abc' }),
    });

    const body = await response.json();
    expect(response.status).toBe(400);
    expect(body.success).toBe(false);
    expect(body.message).toBe('Invalid ID');

    expect(mockDeletePackage).not.toHaveBeenCalled();
  });
});
