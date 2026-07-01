import { ADMIN, MEMBER } from '@/constants/role';
import { SessionUser } from '@/types/session.type';
import { CreateUpdateInvitationFormValues } from '@/validations/member/create-update-invitation';
import { beforeEach, describe, expect, it, mock } from 'bun:test';
import { NextRequest } from 'next/server';
import { GET, POST } from './route';

let mockSession: { user: Pick<SessionUser, 'id' | 'email' | 'role'> } | null =
  null;

mock.module('@/lib/auth', () => ({
  getSession: () => Promise.resolve(mockSession),
}));

const mockGetAllInvitations = mock(() =>
  Promise.resolve({
    data: [
      {
        id: 1,
        slug: 'romeo-juliet',
        groomName: 'Romeo',
        brideName: 'Juliet',
      },
    ],
    meta: {
      total: 1,
      page: 1,
      limit: 10,
      totalPages: 1,
    },
  }),
);

const mockCreateInvitation = mock(
  (_userId: number, _payload: CreateUpdateInvitationFormValues) =>
    Promise.resolve({
      id: 2,
      slug: 'new-groom-bride',
    }),
);

mock.module('@/services/invitation.service', () => ({
  invitationService: {
    getAllInvitations: mockGetAllInvitations,
    createInvitation: mockCreateInvitation,
  },
}));

describe('GET /api/member/invitation (Get All Invitations)', () => {
  beforeEach(() => {
    mockGetAllInvitations.mockClear();
    mockSession = null;
  });

  it('member role can get their invitations', async () => {
    mockSession = { user: { id: 1, email: 'member@wevin.com', role: MEMBER } };
    const request = new NextRequest(
      'http://localhost/api/member/invitation?page=1&limit=10',
    );
    const response = await GET(request);

    const body = await response.json();
    expect(response.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.message).toBe('Invitations fetched successfully');
    expect(body.data.data).toHaveLength(1);
    expect(body.data.data[0].slug).toBe('romeo-juliet');

    expect(mockGetAllInvitations).toHaveBeenCalledWith(1, {
      search: undefined,
      status: undefined,
      page: 1,
      limit: 10,
    });
  });

  it('admin role cannot get their invitations', async () => {
    mockSession = { user: { id: 1, email: 'admin@wevin.com', role: ADMIN } };
    const request = new NextRequest(
      'http://localhost/api/member/invitation?page=1&limit=10',
    );
    const response = await GET(request);

    const body = await response.json();
    expect(response.status).toBe(403);
    expect(body.success).toBe(false);
    expect(body.message).toBe('Forbidden');
    expect(mockGetAllInvitations).not.toHaveBeenCalled();
  });

  it('guest cannot get invitations', async () => {
    mockSession = null;
    const request = new NextRequest(
      'http://localhost/api/member/invitation?page=1&limit=10',
    );
    const response = await GET(request);

    const body = await response.json();
    expect(response.status).toBe(401);
    expect(body.success).toBe(false);
    expect(body.message).toBe('Unauthorized');
    expect(mockGetAllInvitations).not.toHaveBeenCalled();
  });
});

describe('POST /api/member/invitation (Create Invitation)', () => {
  beforeEach(() => {
    mockCreateInvitation.mockClear();
    mockSession = null;
  });

  it('member role can create an invitation', async () => {
    mockSession = { user: { id: 1, email: 'member@wevin.com', role: MEMBER } };
    const request = new NextRequest('http://localhost/api/member/invitation', {
      method: 'POST',
      body: JSON.stringify({
        templateId: 1,
        groomName: 'Romeo',
        brideName: 'Juliet',
        groomFullName: 'Romeo Montague',
        brideFullName: 'Juliet Capulet',
        groomParents: 'Lord and Lady Montague',
        brideParents: 'Lord and Lady Capulet',
        prefixTitle: 'The Wedding of',
        coverGreeting: 'Dear',
        coverQuote: 'Love is in the air',
        heroTitle: 'We are getting married',
        openingGreeting: 'Hello',
        openingMessage: 'Please come',
        closingMessage: 'Thank you',
        closingGreeting: 'Regards',
        events: [
          {
            title: 'Akad',
            date: '2024-12-12',
            time: '08:00',
            location: 'Masjid',
            address: 'Jl. Raya',
          },
        ],
        gallery: [{ imageUrl: 'http://example.com/image.jpg' }],
      }),
    });

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(201);
    expect(body.success).toBe(true);
    expect(body.message).toBe('Invitation created successfully');
    expect(mockCreateInvitation).toHaveBeenCalled();
  });

  it('admin role cannot create an invitation', async () => {
    mockSession = { user: { id: 1, email: 'admin@wevin.com', role: ADMIN } };
    const request = new NextRequest('http://localhost/api/member/invitation', {
      method: 'POST',
      body: JSON.stringify({
        templateId: 1,
        groomName: 'Romeo',
        brideName: 'Juliet',
        groomFullName: 'Romeo Montague',
        brideFullName: 'Juliet Capulet',
        groomParents: 'Lord and Lady Montague',
        brideParents: 'Lord and Lady Capulet',
        prefixTitle: 'The Wedding of',
        coverGreeting: 'Dear',
        coverQuote: 'Love is in the air',
        heroTitle: 'We are getting married',
        openingGreeting: 'Hello',
        openingMessage: 'Please come',
        closingMessage: 'Thank you',
        closingGreeting: 'Regards',
        events: [
          {
            title: 'Akad',
            date: '2024-12-12',
            time: '08:00',
            location: 'Masjid',
            address: 'Jl. Raya',
          },
        ],
        gallery: [{ imageUrl: 'http://example.com/image.jpg' }],
      }),
    });

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(403);
    expect(body.success).toBe(false);
    expect(body.message).toBe('Forbidden');
    expect(mockCreateInvitation).not.toHaveBeenCalled();
  });

  it('guest cannot create an invitation', async () => {
    mockSession = null;
    const request = new NextRequest('http://localhost/api/member/invitation', {
      method: 'POST',
      body: JSON.stringify({
        templateId: '1',
        groomName: 'Romeo',
        brideName: 'Juliet',
      }),
    });

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(401);
    expect(body.success).toBe(false);
    expect(body.message).toBe('Unauthorized');
    expect(mockCreateInvitation).not.toHaveBeenCalled();
  });

  it('validation failed if data body is invalid schema', async () => {
    mockSession = { user: { id: 1, email: 'member@wevin.com', role: MEMBER } };

    const request = new NextRequest('http://localhost/api/member/invitation', {
      method: 'POST',
      body: JSON.stringify({
        templateId: '',
        groomName: '',
      }),
    });

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.success).toBe(false);
    expect(body.message).toBe('Invalid input data');
    expect(body.errors).toBeDefined();
    expect(mockCreateInvitation).not.toHaveBeenCalled();
  });
});
