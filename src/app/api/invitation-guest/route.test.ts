import { ADMIN, MEMBER } from '@/constants/role';
import { GuestStatusEnum } from '@/enums/invitation.enum';
import { SessionUser } from '@/types/session.type';
import { beforeEach, describe, expect, it, mock } from 'bun:test';
import { NextRequest } from 'next/server';
import { GET, POST } from './route';

let mockSession: { user: Pick<SessionUser, 'id' | 'email' | 'role'> } | null =
  null;

mock.module('@/lib/auth', () => ({
  getSession: () => Promise.resolve(mockSession),
}));

const mockGuestData = {
  id: 1,
  invitationId: 10,
  guestName: 'Budi Gunawan',
  phoneNumber: '08123456789',
  status: GuestStatusEnum.Idle,
};

const mockGetAll = mock(() =>
  Promise.resolve({
    items: [mockGuestData],
    total: 1,
  }),
);

const mockCreate = mock(() => Promise.resolve(mockGuestData));
const mockCreateMany = mock(() => Promise.resolve([mockGuestData]));

mock.module('@/services/invitation-guest.service', () => ({
  invitationGuestService: {
    getAll: mockGetAll,
    create: mockCreate,
    createMany: mockCreateMany,
  },
}));

describe('GET /api/invitation-guest (Get All Guests)', () => {
  beforeEach(() => {
    mockGetAll.mockClear();
    mockSession = null;
  });

  it('member role can get guests', async () => {
    mockSession = { user: { id: 2, email: 'member@wevin.com', role: MEMBER } };
    const request = new NextRequest(
      'http://localhost/api/invitation-guest?invitationId=10',
    );
    const response = await GET(request);

    const body = await response.json();
    expect(response.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.message).toBe('Guests fetched successfully');
    expect(mockGetAll).toHaveBeenCalledWith(mockSession.user.id, {
      search: undefined,
      invitationId: 10,
      status: undefined,
      page: 1,
      limit: 10,
    });
  });

  it('admin role cannot get guests via this route (forbidden)', async () => {
    mockSession = { user: { id: 1, email: 'admin@wevin.com', role: ADMIN } };
    const request = new NextRequest('http://localhost/api/invitation-guest');
    const response = await GET(request);

    const body = await response.json();
    expect(response.status).toBe(403);
    expect(body.success).toBe(false);
    expect(body.message).toBe('Forbidden');
    expect(mockGetAll).not.toHaveBeenCalled();
  });

  it('guest cannot get guests (unauthorized)', async () => {
    mockSession = null;
    const request = new NextRequest('http://localhost/api/invitation-guest');
    const response = await GET(request);

    const body = await response.json();
    expect(response.status).toBe(401);
    expect(body.success).toBe(false);
    expect(body.message).toBe('Unauthorized');
    expect(mockGetAll).not.toHaveBeenCalled();
  });
});

describe('POST /api/invitation-guest (Create Guest)', () => {
  beforeEach(() => {
    mockCreate.mockClear();
    mockCreateMany.mockClear();
    mockSession = null;
  });

  const payload = {
    invitationId: 10,
    guestName: 'Budi Gunawan',
    phoneNumber: '08123456789',
    status: GuestStatusEnum.Idle,
  };

  it('member role can create a single guest', async () => {
    mockSession = { user: { id: 2, email: 'member@wevin.com', role: MEMBER } };
    const request = new NextRequest('http://localhost/api/invitation-guest', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    const response = await POST(request);

    const body = await response.json();
    expect(response.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.message).toBe('Guest created successfully');
    expect(mockCreate).toHaveBeenCalled();
  });

  it('member role can create multiple guests (bulk insert)', async () => {
    mockSession = { user: { id: 2, email: 'member@wevin.com', role: MEMBER } };
    const payloadBulk = [payload, { ...payload, guestName: 'Andi' }];

    const request = new NextRequest('http://localhost/api/invitation-guest', {
      method: 'POST',
      body: JSON.stringify(payloadBulk),
    });
    const response = await POST(request);

    const body = await response.json();
    expect(response.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.message).toBe('Guests imported successfully');
    expect(mockCreateMany).toHaveBeenCalled();
  });

  it('admin role cannot create guest', async () => {
    mockSession = { user: { id: 1, email: 'admin@wevin.com', role: ADMIN } };
    const request = new NextRequest('http://localhost/api/invitation-guest', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    const response = await POST(request);

    const body = await response.json();
    expect(response.status).toBe(403);
    expect(body.success).toBe(false);
    expect(body.message).toBe('Forbidden');
    expect(mockCreate).not.toHaveBeenCalled();
  });

  it('guest cannot create guest', async () => {
    mockSession = null;
    const request = new NextRequest('http://localhost/api/invitation-guest', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    const response = await POST(request);

    const body = await response.json();
    expect(response.status).toBe(401);
    expect(body.success).toBe(false);
    expect(body.message).toBe('Unauthorized');
    expect(mockCreate).not.toHaveBeenCalled();
  });

  it('validation failed if single payload is invalid schema', async () => {
    mockSession = { user: { id: 2, email: 'member@wevin.com', role: MEMBER } };
    const invalidPayload = {
      guestName: 'A',
    };
    const request = new NextRequest('http://localhost/api/invitation-guest', {
      method: 'POST',
      body: JSON.stringify(invalidPayload),
    });
    const response = await POST(request);

    const body = await response.json();
    expect(response.status).toBe(400);
    expect(body.success).toBe(false);
    expect(body.message).toBe('Validation failed');
    expect(mockCreate).not.toHaveBeenCalled();
  });
});
