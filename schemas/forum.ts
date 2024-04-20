import { z } from 'zod'

export const postSchema = z.object({
    title: z.string().min(1, { message: 'Campo requerido' }),
    body: z.string().min(1, { message: 'Campo requerido' }).refine((value) => {
        if (value === '<p></p>') {
            return false
        }
        return true
    }, { message: 'Campo requerido' }),
    section: z.string({ invalid_type_error: 'Campo requerido' }),
    subsection: z.string({ invalid_type_error: 'Campo requerido' }),
})