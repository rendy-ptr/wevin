import { templateService } from '@/services/template.service';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const data = await templateService.getAll();
    return NextResponse.json({
      success: true,
      message: 'Templates fetched successfully',
      data,
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json(
      {
        success: false,
        message,
        data: null,
      },
      { status: 500 },
    );
  }
}
