import { z } from 'zod';

export const planCreationSchema = z.object({
  operator: z.string().min(1, 'Operator is required'),
  denomination: z.string().min(1, 'Denomination is required'),
  talkvalue: z.string().min(1, 'Talk value is required'),
  country: z.string().min(1, 'Country is required'),
  start_date: z.string().min(1, 'Start date is required'),
  end_date: z.string().min(1, 'End date is required'),
  type: z.string().min(1, 'Type is required'),
  description: z.string().min(1, 'Description is required'),
  tab_name: z.string().min(1, 'Tab name is required'),
  circle: z.string().min(1, 'Circle is required'),
  validity: z.string().min(1, 'Validity is required'),
  from_date: z.string().min(1, 'From date is required'),
  to_date: z.string().min(1, 'To date is required'),
});

export type PlanCreationFormData = z.infer<typeof planCreationSchema>;