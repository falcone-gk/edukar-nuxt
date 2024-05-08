import { z } from 'zod'

export const postSchema = z.object({
    title: z.string().min(1, { message: 'Campo requerido' }),
    body: z.string({ invalid_type_error: 'Campo requerido' }).optional(),
    image: z.instanceof(File).optional().refine((file) => {
        if (file !== undefined) {
            return file.type.split('/')[0] === 'image'
        }
        return true
    }, { message: 'Archivo no es una imagen.' }),
    section: z.string({ invalid_type_error: 'Campo requerido' }),
    subsection: z.string({ invalid_type_error: 'Campo requerido' }),
}).superRefine(({ image, body }, ctx) => {
    if (image === undefined && ((body === '') || body === '<p></p>')) {
        ctx.addIssue({
            code: 'custom',
            message: 'Debes escribir un texto o subir imagen',
            path: ['body']
        })
    }
})
