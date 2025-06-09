import { z } from 'zod';

export const createCategorySchema = z.object({
    nombre: z.string().min(3, 'El nombre de la categoría debe tener al menos 3 caracteres.'),
    paes: z.enum(['M1', 'M2'], {
        errorMap: () => ({ message: "El valor de PAES debe ser 'M1' o 'M2'." })
    }),
}).strict('Campos no permitidos en la creación de la categoría.');

export const updateCategorySchema = z.object({
    nombre: z.string().min(3, 'El nombre de la categoría debe tener al menos 3 caracteres.').optional(),
    paes: z.enum(['M1', 'M2'], {
        errorMap: () => ({ message: "El valor de PAES debe ser 'M1' o 'M2'." })
    }).optional(),
}).strict('Campos no permitidos en la actualización de la categoría.');