import { z } from 'zod';
import { asString, requiredNumber, requiredString } from '@/lib/schemas/helpers';

export const dealerCreationSchema = z.object({
  firstName: requiredString('First name is required'),
  lastName: requiredString('Last name is required'),
  mobile: z.preprocess(
    asString,
    z.string().min(1, 'Mobile number is required').regex(/^[6-9]\d{9}$/, 'Invalid mobile number'),
  ),
  scmMsisdn: z.string().regex(/^[6-9]\d{9}$/, 'Invalid SCM MSISDN').optional().or(z.literal('')),
  dob: z.preprocess(
    asString,
    z.string().min(1, 'Date of birth is required').regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)'),
  ),
  address: requiredString('Address is required'),
  pincode: z.preprocess(
    asString,
    z.string().min(1, 'Pincode is required').regex(/^\d{6}$/, 'Invalid pincode'),
  ),
  emailId: z.string().email('Invalid email').optional().or(z.literal('')),
  dealerType: requiredString('Dealer type is required'),
  circleId: requiredNumber('Circle is required'),
  ssaId: requiredNumber('SSA is required'),
  category: requiredString('Category is required'),
  franchiseMsisdn: z.string().optional().or(z.literal('')),
  subFranchiseMsisdn: z.string().optional().or(z.literal('')),
  aadhaarId: z.string().regex(/^\d{12}$/, 'Invalid Aadhaar number').optional().or(z.literal('')),
  panId: z.string().regex(/[A-Z]{5}[0-9]{4}[A-Z]{1}/, 'Invalid PAN format').optional().or(z.literal('')),
  gstNumber: z.string().regex(/\d{2}[A-Z]{5}\d{4}[A-Z]{1}[1-9A-Z]{1}[Z]{1}[A-Z\d]{1}/, 'Invalid GST format').optional().or(z.literal('')),
  tds: z.string().optional(),
  tdsCategory: z.string().optional(),
});

export type DealerCreationFormData = z.infer<typeof dealerCreationSchema>;
