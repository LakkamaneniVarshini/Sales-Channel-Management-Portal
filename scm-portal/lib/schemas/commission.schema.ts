import { z } from 'zod';

export const prepaidCommissionSchema = z.object({
  masterCategoryId: z.string().min(1, 'Category is required'),
  circleId: z.string().min(1, 'Circle is required'),
  sellerCommission: z.string().min(1, 'Seller commission is required'),
  fraCommission: z.string().min(1, 'FRA commission is required'),
  subCommission: z.string().min(1, 'Sub commission is required'),
  tds: z.string().min(1, 'TDS is required'),
  denomination: z.string().min(1, 'Denomination is required'),
  categoryId: z.string().min(1, 'Category is required'),
  commissionType: z.string().min(1, 'Commission type is required'),
  dtype: z.string().min(1, 'Dtype is required'),
});

export const postpaidCommissionSchema = z.object({
  categoryId: z.string().min(1, 'Category is required'),
  circleId: z.string().min(1, 'Circle is required'),
  tdsAmount: z.string().min(1, 'TDS amount is required'),
  fraCommission: z.string().min(1, 'FRA commission is required'),
  actualCommission: z.string().min(1, 'Actual commission is required'),
  sellerLevel: z.string().min(1, 'Seller level is required'),
  cap_limit: z.string().min(1, 'Cap limit is required'),
  zoneId: z.string().min(1, 'Zone is required'),
});

export const landlineCommissionSchema = z.object({
  categoryId: z.string().min(1, 'Category is required'),
  circleId: z.string().min(1, 'Circle is required'),
  tdsAmount: z.string().min(1, 'TDS amount is required'),
  sellerLevel: z.string().min(1, 'Seller level is required'),
  commissionAmount: z.string().min(1, 'Commission amount is required'),
  fromAmount: z.string().min(1, 'From amount is required'),
  toAmount: z.string().min(1, 'To amount is required'),
  dtype: z.string().min(1, 'Dtype is required'),
  zoneId: z.string().min(1, 'Zone is required'),
});

export type PrepaidCommissionFormData = z.infer<typeof prepaidCommissionSchema>;
export type PostpaidCommissionFormData = z.infer<typeof postpaidCommissionSchema>;
export type LandlineCommissionFormData = z.infer<typeof landlineCommissionSchema>;