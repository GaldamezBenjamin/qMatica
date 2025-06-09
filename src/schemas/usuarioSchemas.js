import { z } from 'zod';

export const UserBaseSchema = z.object({
  username: z.string()
    .min(3, 'El nombre de usuario debe tener al menos 3 caracteres')
    .max(30, 'El nombre de usuario no puede exceder los 30 caracteres'),
  email: z.string()
    .email('Formato de correo electrónico inválido'),
  rol: z.enum(['usuario', 'admin'])
});

export const UserSubscriptionSchema = z.object({
  suscrito: z.boolean(),
  fecha_inicio: z.string().datetime().optional().nullable(),
  fecha_fin: z.string().datetime().optional().nullable()
});

export const UserExperienceSchema = z.object({
  actual: z.number().min(0, 'La experiencia no puede ser negativa'),
  anterior: z.number().min(0, 'La experiencia no puede ser negativa')
});

export const UserFullSchema = UserBaseSchema.extend({
  suscripcion: UserSubscriptionSchema.optional(),
  exp: UserExperienceSchema.optional()
});