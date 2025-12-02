import { z } from 'zod';

export const UserRegistrationSchema = z.object({
  name: z.string().min(3, { message: 'Nome deve ter no mínimo 3 caracteres.' }),
  email: z.string().email({ message: 'E-mail inválido.' }),
  password: z.string().min(6, { message: 'Senha deve ter no mínimo 6 caracteres.' }),
  phone: z.string().optional().refine(val => !val || val.replace(/\D/g, '').length >= 10, { message: 'Telefone deve ter no mínimo 10 dígitos.' }),
  cep: z.string().optional().refine(val => !val || val.replace(/\D/g, '').length === 8, { message: 'CEP deve ter 8 dígitos.' }),
  addressStreet: z.string().optional(),
  addressNumber: z.string().optional(),
  addressNeighborhood: z.string().optional(),
  addressCity: z.string().optional(),
  addressState: z.string().optional().refine(val => !val || val.length === 2, { message: 'UF deve ter 2 letras.' }),
  addressComplement: z.string().optional(),
  country: z.string().optional(),
});
