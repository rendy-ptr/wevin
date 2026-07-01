import { ADMIN } from '@/constants/role';
import { withAuth } from '@/lib/with-auth';
import { packageService } from '@/services/package.service';
import { createUpdatePackageSchema } from '@/validations/admin/create-update-package';
import { NextRequest, NextResponse } from 'next/server';

export const PUT = withAuth(
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

    const body = await request.json();
    const parsed = createUpdatePackageSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: 'Validation failed',
          data: undefined,
          errors: parsed.error.issues,
        },
        { status: 400 },
      );
    }

    const packageData = await packageService.update(
      Number(id),
      parsed.data,
      session.user.id,
    );

    return NextResponse.json(
      {
        success: true,
        message: 'Package updated successfully',
        data: packageData,
      },
      { status: 200 },
    );
  },
);

export const DELETE = withAuth(
  [ADMIN],
  async (
    _request: NextRequest,
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

    const packageData = await packageService.delete(
      Number(id),
      session.user.id,
    );

    return NextResponse.json(
      {
        success: true,
        message: 'Package deleted successfully',
        data: packageData,
      },
      { status: 200 },
    );
  },
);
