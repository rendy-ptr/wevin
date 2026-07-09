import { ADMIN, MEMBER } from '@/constants/role';
import { ACTIVE, INACTIVE } from '@/constants/user.constant';
import { SessionUser } from '@/types/session.type';
import { TUserStatus } from '@/types/user.type';
import { CreateUpdateMemberFormValues } from '@/validations/admin/create-update-member';
import { beforeEach, describe, expect, it, mock } from 'bun:test';
import { NextRequest } from 'next/server';
import { DELETE, PATCH, PUT } from './route';

let mockSession: { user: Pick<SessionUser, 'id' | 'email' | 'role'> } | null =
  null;

mock.module('@/lib/auth', () => ({
  getSession: () => Promise.resolve(mockSession),
}));

const mockUpdate = mock(
  (id: number, payload: Omit<CreateUpdateMemberFormValues, 'email'>) =>
    Promise.resolve({
      id,
      name: payload.name,
      email: 'budi@example.com',
    }),
);

const mockUpdateStatus = mock((id: number, status: TUserStatus) =>
  Promise.resolve({
    id,
    name: 'Budi Santoso',
    email: 'budi@example.com',
    status,
  }),
);

const mockDelete = mock((id: number) =>
  Promise.resolve({
    id,
    name: 'Budi Santoso',
    email: 'budi@example.com',
  }),
);

mock.module('@/services/member.service', () => ({
  memberService: {
    update: mockUpdate,
    updateStatus: mockUpdateStatus,
    delete: mockDelete,
  },
}));

describe('PUT /api/member/[id] (Update Member)', () => {
  beforeEach(() => {
    mockUpdate.mockClear();
    mockSession = null;
  });

  const payload_data = {
    id: 1,
    name: 'Budi Santoso',
    email: 'budi@example.com',
    packageId: 1,
  };

  it('admin role can update member', async () => {
    mockSession = { user: { id: 1, email: 'admin@wevin.com', role: ADMIN } };
    const request = new NextRequest(
      `http://localhost/api/member/${payload_data.id}`,
      {
        method: 'PUT',
        body: JSON.stringify(payload_data),
      },
    );
    const response = await PUT(request, {
      params: Promise.resolve({ id: payload_data.id.toString() }),
    });

    const body = await response.json();
    expect(response.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.message).toBe('Member updated successfully');
    expect(mockUpdate).toHaveBeenCalledWith(
      payload_data.id,
      {
        name: payload_data.name,
        packageId: payload_data.packageId,
      },
      mockSession.user.id,
    );
  });

  it('member role cannot update member', async () => {
    mockSession = {
      user: { id: 2, email: 'member@wevin.com', role: MEMBER },
    };
    const request = new NextRequest(
      `http://localhost/api/member/${payload_data.id}`,
      {
        method: 'PUT',
        body: JSON.stringify(payload_data),
      },
    );
    const response = await PUT(request, {
      params: Promise.resolve({ id: payload_data.id.toString() }),
    });

    const body = await response.json();
    expect(response.status).toBe(403);
    expect(body.success).toBe(false);
    expect(body.message).toBe('Forbidden');
    expect(mockUpdate).not.toHaveBeenCalled();
  });

  it('guest cannot update member', async () => {
    mockSession = null;
    const request = new NextRequest(
      `http://localhost/api/member/${payload_data.id}`,
      {
        method: 'PUT',
        body: JSON.stringify(payload_data),
      },
    );
    const response = await PUT(request, {
      params: Promise.resolve({ id: payload_data.id.toString() }),
    });

    const body = await response.json();
    expect(response.status).toBe(401);
    expect(body.success).toBe(false);
    expect(body.message).toBe('Unauthorized');
    expect(mockUpdate).not.toHaveBeenCalled();
  });

  it('validation failed if data body is invalid schema', async () => {
    mockSession = { user: { id: 99, email: 'admin@wevin.com', role: ADMIN } };
    const request = new NextRequest(
      `http://localhost/api/member/${payload_data.id}`,
      {
        method: 'PUT',
        body: JSON.stringify({
          name: 'A',
          email: 'invalid-email',
          packageId: -1,
        }),
      },
    );
    const response = await PUT(request, {
      params: Promise.resolve({ id: payload_data.id.toString() }),
    });

    const body = await response.json();
    expect(response.status).toBe(400);
    expect(body.success).toBe(false);
    expect(body.message).toBe('Validation failed');
    expect(body.data).toBeUndefined();
    expect(body.errors).toBeDefined();
    expect(mockUpdate).not.toHaveBeenCalled();
  });

  it('returns 400 if ID is invalid', async () => {
    mockSession = { user: { id: 1, email: 'admin@wevin.com', role: ADMIN } };

    const request = new NextRequest('http://localhost/api/member/abc');
    const response = await PUT(request, {
      params: Promise.resolve({ id: 'abc' }),
    });

    const body = await response.json();
    expect(response.status).toBe(400);
    expect(body.success).toBe(false);
    expect(body.message).toBe('Invalid ID');

    expect(mockUpdate).not.toHaveBeenCalled();
  });
});

describe('PATCH /api/member/[id] (Update Status Member)', () => {
  beforeEach(() => {
    mockUpdateStatus.mockClear();
    mockSession = null;
  });

  const statusOptions = [ACTIVE, INACTIVE] as const;
  const payload_data = {
    id: 1,
    status: statusOptions[Math.floor(Math.random() * statusOptions.length)],
  };

  it('admin role can update status member', async () => {
    mockSession = { user: { id: 1, email: 'admin@wevin.com', role: ADMIN } };
    const request = new NextRequest(
      `http://localhost/api/member/${payload_data.id}`,
      {
        method: 'PATCH',
        body: JSON.stringify(payload_data),
      },
    );
    const response = await PATCH(request, {
      params: Promise.resolve({ id: payload_data.id.toString() }),
    });

    const body = await response.json();
    expect(response.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.message).toBe('Member status updated successfully');
    expect(mockUpdateStatus).toHaveBeenCalledWith(
      payload_data.id,
      payload_data.status,
      mockSession.user.id,
    );
  });

  it('member role cannot update status member', async () => {
    mockSession = {
      user: { id: 2, email: 'member@wevin.com', role: MEMBER },
    };
    const request = new NextRequest(
      `http://localhost/api/member/${payload_data.id}`,
      {
        method: 'PATCH',
        body: JSON.stringify(payload_data),
      },
    );
    const response = await PATCH(request, {
      params: Promise.resolve({ id: payload_data.id.toString() }),
    });

    const body = await response.json();
    expect(response.status).toBe(403);
    expect(body.success).toBe(false);
    expect(body.message).toBe('Forbidden');
    expect(mockUpdateStatus).not.toHaveBeenCalled();
  });

  it('guest cannot update status member', async () => {
    mockSession = null;
    const request = new NextRequest(
      `http://localhost/api/member/${payload_data.id}`,
      {
        method: 'PATCH',
        body: JSON.stringify(payload_data),
      },
    );
    const response = await PATCH(request, {
      params: Promise.resolve({ id: payload_data.id.toString() }),
    });

    const body = await response.json();
    expect(response.status).toBe(401);
    expect(body.success).toBe(false);
    expect(body.message).toBe('Unauthorized');
    expect(mockUpdateStatus).not.toHaveBeenCalled();
  });

  it('validation failed if data body is invalid schema', async () => {
    mockSession = { user: { id: 99, email: 'admin@wevin.com', role: ADMIN } };
    const request = new NextRequest(
      `http://localhost/api/member/${payload_data.id}`,
      {
        method: 'PATCH',
        body: JSON.stringify({
          status: 'invalid',
        }),
      },
    );
    const response = await PATCH(request, {
      params: Promise.resolve({ id: payload_data.id.toString() }),
    });

    const body = await response.json();
    expect(response.status).toBe(400);
    expect(body.success).toBe(false);
    expect(body.message).toBe('Validation failed');
    expect(body.data).toBeUndefined();
    expect(body.errors).toBeDefined();
    expect(mockUpdateStatus).not.toHaveBeenCalled();
  });

  it('returns 400 if ID is invalid', async () => {
    mockSession = { user: { id: 1, email: 'admin@wevin.com', role: ADMIN } };

    const request = new NextRequest('http://localhost/api/member/abc');
    const response = await PATCH(request, {
      params: Promise.resolve({ id: 'abc' }),
    });

    const body = await response.json();
    expect(response.status).toBe(400);
    expect(body.success).toBe(false);
    expect(body.message).toBe('Invalid ID');

    expect(mockUpdateStatus).not.toHaveBeenCalled();
  });
});

describe('DELETE /api/member/[id] (Delete Member)', () => {
  beforeEach(() => {
    mockDelete.mockClear();
    mockSession = null;
  });

  const payload_data = {
    id: 1,
  };

  it('admin role can delete member', async () => {
    mockSession = { user: { id: 1, email: 'admin@wevin.com', role: ADMIN } };
    const request = new NextRequest(
      `http://localhost/api/member/${payload_data.id}`,
      {
        method: 'DELETE',
      },
    );
    const response = await DELETE(request, {
      params: Promise.resolve({ id: payload_data.id.toString() }),
    });

    const body = await response.json();
    expect(response.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.message).toBe('Member deleted successfully');
    expect(mockDelete).toHaveBeenCalledWith(
      payload_data.id,
      mockSession.user.id,
    );
  });

  it('member role cannot delete member', async () => {
    mockSession = {
      user: { id: 2, email: 'member@wevin.com', role: MEMBER },
    };
    const request = new NextRequest(
      `http://localhost/api/member/${payload_data.id}`,
      {
        method: 'DELETE',
      },
    );
    const response = await DELETE(request, {
      params: Promise.resolve({ id: payload_data.id.toString() }),
    });

    const body = await response.json();
    expect(response.status).toBe(403);
    expect(body.success).toBe(false);
    expect(body.message).toBe('Forbidden');
    expect(mockDelete).not.toHaveBeenCalled();
  });

  it('guest cannot delete member', async () => {
    mockSession = null;
    const request = new NextRequest(
      `http://localhost/api/member/${payload_data.id}`,
      {
        method: 'DELETE',
      },
    );
    const response = await DELETE(request, {
      params: Promise.resolve({ id: payload_data.id.toString() }),
    });

    const body = await response.json();
    expect(response.status).toBe(401);
    expect(body.success).toBe(false);
    expect(body.message).toBe('Unauthorized');
    expect(mockDelete).not.toHaveBeenCalled();
  });

  it('returns 400 if ID is invalid', async () => {
    mockSession = { user: { id: 1, email: 'admin@wevin.com', role: ADMIN } };

    const request = new NextRequest('http://localhost/api/member/abc');
    const response = await DELETE(request, {
      params: Promise.resolve({ id: 'abc' }),
    });

    const body = await response.json();
    expect(response.status).toBe(400);
    expect(body.success).toBe(false);
    expect(body.message).toBe('Invalid ID');

    expect(mockDelete).not.toHaveBeenCalled();
  });
});
