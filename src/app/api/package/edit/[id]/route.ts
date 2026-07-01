import { ADMIN } from '@/constants/role';
import { withAuth } from '@/lib/with-auth';
import { packageService } from '@/services/package.service';
import { NextRequest, NextResponse } from 'next/server';

export const GET = withAuth(
  [ADMIN],
  async (
    request: NextRequest,
    session,
    { params }: { params: Promise<{ id: string }> },
  ) => {
    const { id } = await params;

    if (isNaN(Number(id))) {
      return NextResponse.json(
        { success: false, message: 'Invalid ID' },
        { status: 400 },
      );
    }

    const packageData = await packageService.getWithRelationships(Number(id));

    return NextResponse.json(
      {
        success: true,
        message: 'Package fetched successfully',
        data: packageData,
      },
      { status: 200 },
    );
  },
);
