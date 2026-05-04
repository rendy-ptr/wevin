import { BenefitType, SystemAction } from '@/constants/benefits';

export interface Benefit {
  id: number;
  name: string;
  key: SystemAction;
  description: string | null;
  type: BenefitType;
  createdAt: Date;
  updatedAt: Date;
}
