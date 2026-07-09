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

const mockGetInvitationById = mock((id: number, _userId: number) => {
  if (id === 1) {
    return Promise.resolve({
      id: 1,
      slug: 'romeo-juliet',
      groomName: 'Romeo',
      brideName: 'Juliet',
    });
  }
  return Promise.reject(
    new Error('Invitation not found or unauthorized access.'),
  );
});

const mockUpdateInvitation = mock(
  (id: number, _userId: number, _data: unknown) => {
    return Promise.resolve({
      id,
      slug: 'rendy-winka',
    });
  },
);

const mockDeleteInvitation = mock((id: number, _userId: number) => {
  if (id === 1) return Promise.resolve({ success: true });
  return Promise.reject(new Error('Invitation not found'));
});

mock.module('@/services/invitation.service', () => ({
  invitationService: {
    getInvitationById: mockGetInvitationById,
    updateInvitation: mockUpdateInvitation,
    deleteInvitation: mockDeleteInvitation,
  },
}));

describe('GET /api/invitation/[id] (Get Invitation By ID)', () => {
  beforeEach(() => {
    mockGetInvitationById.mockClear();
    mockSession = null;
  });

  it('member role can get their own invitation', async () => {
    mockSession = { user: { id: 1, email: 'member@wevin.com', role: MEMBER } };

    const request = new NextRequest('http://localhost/api/invitation/1');
    const response = await GET(request, {
      params: Promise.resolve({ id: '1' }),
    });

    const body = await response.json();
    expect(response.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.message).toBe('Invitation fetched successfully');
    expect(body.data.slug).toBe('romeo-juliet');

    expect(mockGetInvitationById).toHaveBeenCalledWith(1, 1);
  });

  it('admin role cannot get invitation', async () => {
    mockSession = { user: { id: 1, email: 'admin@wevin.com', role: ADMIN } };

    const request = new NextRequest('http://localhost/api/invitation/1');
    const response = await GET(request, {
      params: Promise.resolve({ id: '1' }),
    });

    const body = await response.json();
    expect(response.status).toBe(403);
    expect(body.success).toBe(false);
    expect(body.message).toBe('Forbidden');

    expect(mockGetInvitationById).not.toHaveBeenCalled();
  });

  it('guest cannot get invitation', async () => {
    mockSession = null;
    const request = new NextRequest('http://localhost/api/invitation/1');
    const response = await GET(request, {
      params: Promise.resolve({ id: '1' }),
    });

    const body = await response.json();
    expect(response.status).toBe(401);
    expect(body.success).toBe(false);
    expect(body.message).toBe('Unauthorized');

    expect(mockGetInvitationById).not.toHaveBeenCalled();
  });

  it('returns 400 if ID is invalid', async () => {
    mockSession = { user: { id: 1, email: 'member@wevin.com', role: MEMBER } };

    const request = new NextRequest('http://localhost/api/invitation/abc');
    const response = await GET(request, {
      params: Promise.resolve({ id: 'abc' }),
    });

    const body = await response.json();
    expect(response.status).toBe(400);
    expect(body.success).toBe(false);
    expect(body.message).toBe('Invalid ID');

    expect(mockGetInvitationById).not.toHaveBeenCalled();
  });
});

describe('PUT /api/invitation/[id] (Update Invitation)', () => {
  const validPayload = {
    templateId: 1,
    status: 'draft',
    groomName: 'Rendy',
    brideName: 'Winka',
    groomFullName: 'Rendy Santoso',
    brideFullName: 'Winka Putri',
    groomParents: 'Bapak & Ibu Rendy',
    brideParents: 'Bapak & Ibu Winka',
    prefixTitle: 'The Wedding of',
    heroTitle: 'Rendy & Winka',
    coverGreeting: 'Save the Date',
    coverQuote: 'Love is in the air',
    openingGreeting: 'Assalamualaikum',
    openingMessage: 'Dengan memohon rahmat',
    closingGreeting: 'Wassalamualaikum',
    closingMessage: 'Terima kasih',
    musicUrl: '',
    liveStreamUrl: '',
    enabledFeatures: {},
    events: [
      {
        title: 'Akad Nikah',
        date: '2026-12-12',
        time: '08:00',
        timezone: 'WIB',
        location: 'Masjid Agung',
        address: 'Jl. Merdeka No 1',
      },
    ],
    gallery: [{ imageUrl: 'https://example.com/photo.jpg' }],
  };

  beforeEach(() => {
    mockUpdateInvitation.mockClear();
    mockSession = null;
  });

  it('member role can update their own invitation', async () => {
    const { PUT } = await import('./route');
    mockSession = { user: { id: 1, email: 'member@wevin.com', role: MEMBER } };

    const request = new NextRequest('http://localhost/api/invitation/1', {
      method: 'PUT',
      body: JSON.stringify(validPayload),
    });

    const response = await PUT(request, {
      params: Promise.resolve({ id: '1' }),
    });

    const body = await response.json();
    expect(response.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.message).toBe('Invitation updated successfully');
    expect(body.data.slug).toBe('rendy-winka');

    expect(mockUpdateInvitation).toHaveBeenCalledWith(1, 1, expect.any(Object));
  });

  it('admin role cannot update invitation', async () => {
    const { PUT } = await import('./route');
    mockSession = { user: { id: 1, email: 'admin@wevin.com', role: ADMIN } };

    const request = new NextRequest('http://localhost/api/invitation/1', {
      method: 'PUT',
      body: JSON.stringify(validPayload),
    });

    const response = await PUT(request, {
      params: Promise.resolve({ id: '1' }),
    });

    const body = await response.json();
    expect(response.status).toBe(403);
    expect(body.success).toBe(false);
    expect(body.message).toBe('Forbidden');

    expect(mockUpdateInvitation).not.toHaveBeenCalled();
  });

  it('guest cannot update invitation', async () => {
    const { PUT } = await import('./route');
    mockSession = null;

    const request = new NextRequest('http://localhost/api/invitation/1', {
      method: 'PUT',
      body: JSON.stringify(validPayload),
    });

    const response = await PUT(request, {
      params: Promise.resolve({ id: '1' }),
    });

    const body = await response.json();
    expect(response.status).toBe(401);
    expect(body.success).toBe(false);
    expect(body.message).toBe('Unauthorized');

    expect(mockUpdateInvitation).not.toHaveBeenCalled();
  });

  it('returns 400 if validation fails', async () => {
    const { PUT } = await import('./route');
    mockSession = { user: { id: 1, email: 'member@wevin.com', role: MEMBER } };

    const request = new NextRequest('http://localhost/api/invitation/1', {
      method: 'PUT',
      body: JSON.stringify({ templateId: 'invalid' }),
    });

    const response = await PUT(request, {
      params: Promise.resolve({ id: '1' }),
    });

    const body = await response.json();
    expect(response.status).toBe(400);
    expect(body.success).toBe(false);
    expect(body.message).toBe('Invalid input data');

    expect(mockUpdateInvitation).not.toHaveBeenCalled();
  });
});

describe('DELETE /api/invitation/[id] (Delete Invitation)', () => {
  beforeEach(() => {
    mockDeleteInvitation.mockClear();
    mockSession = null;
  });

  it('member role can delete their own invitation', async () => {
    const { DELETE } = await import('./route');
    mockSession = { user: { id: 1, email: 'member@wevin.com', role: MEMBER } };

    const request = new NextRequest('http://localhost/api/invitation/1', {
      method: 'DELETE',
    });

    const response = await DELETE(request, {
      params: Promise.resolve({ id: '1' }),
    });

    const body = await response.json();
    expect(response.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.message).toBe('Invitation deleted successfully');

    expect(mockDeleteInvitation).toHaveBeenCalledWith(1, 1);
  });

  it('admin role cannot delete member invitation via this route', async () => {
    const { DELETE } = await import('./route');
    mockSession = { user: { id: 1, email: 'admin@wevin.com', role: ADMIN } };

    const request = new NextRequest('http://localhost/api/invitation/1', {
      method: 'DELETE',
    });

    const response = await DELETE(request, {
      params: Promise.resolve({ id: '1' }),
    });

    const body = await response.json();
    expect(response.status).toBe(403);
    expect(body.success).toBe(false);

    expect(mockDeleteInvitation).not.toHaveBeenCalled();
  });
});
