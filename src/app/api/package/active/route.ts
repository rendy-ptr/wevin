import { AppError } from '@/lib/errors';
import { packageService } from '@/services/package.service';
import { BasePackageBenefitModel } from '@/types/benefit.type';
import { BasePackageModel } from '@/types/package.type';
import {
  BasePackageTemplateModel,
  BaseTemplateModel,
} from '@/types/template.type';
import { NextResponse } from 'next/server';

export async function GET(): Promise<
  NextResponse<{
    success: boolean;
    message: string;
    data:
      | (Pick<BasePackageModel, 'id' | 'name' | 'price'> & {
          benefits: Pick<
            BasePackageBenefitModel,
            'id' | 'benefitKey' | 'toggleValue' | 'quotaValue'
          >[];
          templates: (BasePackageTemplateModel & {
            template: Pick<BaseTemplateModel, 'id' | 'name'>;
          })[];
        })[]
      | undefined;
  }>
> {
  try {
    const packages = await packageService.getActiveWithBenefits();
    return NextResponse.json({
      success: true,
      message: 'Active packages fetched successfully',
      data: packages,
    });
  } catch (error: unknown) {
    const isAppError = error instanceof AppError;
    const message =
      error instanceof Error ? error.message : 'Internal Server Error';
    const status = isAppError ? error.statusCode : 500;

    return NextResponse.json(
      {
        success: false,
        message,
        data: undefined,
      },
      { status },
    );
  }
}
