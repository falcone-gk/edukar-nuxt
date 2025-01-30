import { z } from "zod";

export const paymentSchema = z.object({
  first_name: z.string().min(1, { message: "Campo requerido" }).max(150),
  last_name: z.string().min(1, { message: "Campo requerido" }).max(150),
  email: z.string().email({ message: "Email inválido" }),
  isAcceptedTerms: z.literal<boolean>(true),
});
