import { ADMIN } from '@/constants/role';
import { withAuth } from '@/lib/with-auth';
import { packageService } from '@/services/package.service';
import { PackageFilterParams } from '@/types/package.type';
import { createUpdatePackageSchema } from '@/validations/admin/create-update-package';
import { NextRequest, NextResponse } from 'next/server';

export const GET = withAuth([ADMIN], async (request: NextRequest) => {
  const { searchParams } = new URL(request.url);
  const filters = {
    search: searchParams.get('search') || undefined,
    isActive: searchParams.get('isActive') || undefined,
    isPopular: searchParams.get('isPopular') || undefined,
    page: parseInt(searchParams.get('page') || '1'),
    limit: parseInt(searchParams.get('limit') || '10'),
  } as PackageFilterParams;

  const packageData = await packageService.getAll(filters);
  return NextResponse.json({
    success: true,
    message: 'Packages fetched successfully',
    data: packageData,
  });
});

export const POST = withAuth([ADMIN], async (request: NextRequest, session) => {
  const body = await request.json();
  const parsed = createUpdatePackageSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        success: false,
        message: 'Validation failed',
        errors: parsed.error.issues,
      },
      { status: 400 },
    );
  }

  const packageData = await packageService.create(parsed.data, session.user.id);
  return NextResponse.json(
    {
      success: true,
      message: 'Package created successfully',
      data: packageData,
    },
    { status: 201 },
  );
});
