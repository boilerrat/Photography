import { z } from 'zod';

export const rollMetaSchema = z.object({
  rollId: z.string().min(1, 'Roll ID is required'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  camera: z.string().min(1, 'Camera is required'),
  lens: z.string().min(1, 'Lens is required'),
  filmStock: z.string().min(1, 'Film stock is required'),
  ratedISO: z.string().min(1, 'Rated ISO is required'),
  meterISO: z.string().min(1, 'Meter ISO is required'),
  exposures: z.number().min(1, 'Exposures must be at least 1').max(72, 'Exposures cannot exceed 72'),
});

export const shotSchema = z.object({
  shotNumber: z.number().min(1, 'Shot number must be at least 1'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format').optional(),
  filmSpeed: z.string().optional(),
  aperture: z.string().optional(),
  exposureAdjustments: z.string().optional(),
  notes: z.string().optional(),
  imageUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
});

export const rollDocSchema = z.object({
  meta: rollMetaSchema,
  shots: z.array(shotSchema),
});

export const saveRequestSchema = z.object({
  doc: rollDocSchema,
  storageMode: z.enum(['download', 'github']),
});

// Validation helper functions
export function validateRollMeta(data: unknown) {
  return rollMetaSchema.parse(data);
}

export function validateShot(data: unknown) {
  return shotSchema.parse(data);
}

export function validateRollDoc(data: unknown) {
  return rollDocSchema.parse(data);
}

export function validateSaveRequest(data: unknown) {
  return saveRequestSchema.parse(data);
}
