import { z } from 'zod'

const userRegisterSchema = z.object({
    username: z.string().min(1, { message: 'Campo requerido' }).max(150),
    email: z.string().email({ message: 'Email inválido' }),
    first_name: z.string().min(1, { message: 'Campo requerido' }).max(150),
    last_name: z.string().min(1, { message: 'Campo requerido' }).max(150),
    password: z.string().min(1, { message: 'Campo requerido' }),
    re_password: z.string().min(1, { message: 'Campo requerido' }),
    picture: z.instanceof(File).optional().refine((file) => {
        if (file !== undefined) {
            return file.type.split('/')[0] === 'image'
        }
        return true
    }, { message: 'Archivo no es una imagen.' }),
    about_me: z.string().optional()
}).superRefine(({ re_password, password }, ctx) => {
    if (re_password !== password) {
        ctx.addIssue({
            code: 'custom',
            message: 'Las contraseñas no coinciden',
            path: ['re_password']
        })
    }
})

const userLoginSchema = z.object({
    username: z.string().min(1, { message: 'Campo requerido' }).max(150),
    password: z.string().min(1, { message: 'Campo requerido' }),
})

const userUpdateSchema = z.object({
    username: z.string().min(1, { message: 'Campo requerido' }).max(150),
    first_name: z.string().min(1, { message: 'Campo requerido' }).max(150),
    last_name: z.string().min(1, { message: 'Campo requerido' }).max(150),
    picture: z.instanceof(File).optional().refine((file) => {
        if (file !== undefined) {
            return file.type.split('/')[0] === 'image'
        }
        return true
    }, { message: 'Archivo no es una imagen.' }),
    about_me: z.string().optional()
})

export { userRegisterSchema, userLoginSchema, userUpdateSchema }