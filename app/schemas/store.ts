import { z } from "zod";

export const paymentSchema = z.object({
  first_name: z.string().min(1, { message: "Campo requerido" }).max(150),
  last_name: z.string().min(1, { message: "Campo requerido" }).max(150),
  email: z.string().email({ message: "Email inválido" }),
  phone_number: z
    .string()
    .min(5, {
      message: "El número de teléfono debe tener mínimo 5 dígitos",
    })
    .max(15, {
      message: "El número de teléfono debe tener máximo 15 dígitos",
    })
    .regex(/^\d{9}$/, {
      message: "El número de teléfono debe contener solo dígitos",
    }),
  // isAcceptedTerms: z.literal<boolean>(true),
});
