import { z } from 'zod'

const userRegisterSchema = z.object({
    username: z.string().min(1, {message: 'Campo requerido'}).max(150),
    email: z.string().email({message: 'Email inválido'}),
    name: z.string().min(1, {message: 'Campo requerido'}).max(150),
    lastName: z.string().min(1, {message: 'Campo requerido'}).max(150),
    password: z.string().min(1, {message: 'Campo requerido'}),
    confirmPassword: z.string().min(1, {message: 'Campo requerido'}),
    picture: z.instanceof(File).optional().refine((file) => {
        if (file !== undefined) {
            return file.type.split('/')[0] === 'image'
        }
        return true
    }, { message: 'Archivo no es una imagen.' }),
    aboutMe: z.string().optional()
}).superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
        ctx.addIssue({
            code: 'custom',
            message: 'Las contraseñas no coinciden',
            path: ['confirmPassword']
        })
    }
})

const userLoginSchema = z.object({
    username: z.string().min(1, {message: 'Campo requerido'}).max(150),
    password: z.string().min(1, {message: 'Campo requerido'}),
})

export { userRegisterSchema, userLoginSchema }