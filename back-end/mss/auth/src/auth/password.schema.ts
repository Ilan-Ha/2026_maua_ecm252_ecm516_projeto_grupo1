import { z } from 'zod';

export const authSchemaZod = z
  .object({
    email: z.string().email('Formato de email invalido').trim().toLowerCase(),
    senha: z
      .string()
      .min(8, 'Minimo de 8 Caracteres')
      .max(100, 'Maximo de 100 caracteres')
      .regex(/[A-Z]/, 'Deve conter pelo menos uma letra maiuscula')
      .regex(/[a-z]/, 'Deve conter pelo menos uma letra minuscula')
      .regex(/[0-9]/, 'Deve conter pelo menos um numero')
      .regex(/[^A-Za-z0-9]/, 'Deve conter pelo menos um caracter especial'),
    confirmarSenha: z.string(),
  })
  .refine((data) => data.senha === data.confirmarSenha, {
    message: 'Senhas não são iguais',
    path: ['confirmarSenha'],
  });

type TreeNode = {
  errors?: string[];
  properties?: Record<string, TreeNode>;
};

export function formatZodPasswordErrors(
  error: z.ZodError,
): Record<string, string[]> {
  const tree = z.treeifyError(error) as TreeNode;
  const errosFormatados = tree.properties || {};
  const errors: Record<string, string[]> = {};

  for (const [tipo, erros] of Object.entries(errosFormatados)) {
    if (erros?.errors && erros.errors.length > 0) {
      errors[tipo] = erros.errors;
    }
  }
  return errors;
}
