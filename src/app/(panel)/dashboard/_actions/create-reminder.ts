"use server"; // Indica que esse código deve ser executado no servidor (server actions do Next.js)

import prisma from "@/lib/prisma"; // Importa o cliente Prisma para acessar o banco de dados
import { z } from "zod"; // Importa o Zod para validação de dados
import { revalidatePath } from "next/cache"; // Função do Next.js para revalidar rotas após alterações
import { auth } from "@/lib/auth"; // Função que retorna a sessão do usuário autenticado

// Esquema de validação do formulário, garante que a descrição seja obrigatória
const formSchema = z.object({
  description: z.string().min(1, "A descrição do lembrete é obrigatória"),
});

// Tipo inferido automaticamente a partir do schema
type FormSchema = z.infer<typeof formSchema>;

// Função assíncrona responsável por criar um novo lembrete
export async function createReminder(formData: FormSchema) {
  // Busca a sessão do usuário
  const session = await auth();

  // Se não houver usuário logado, retorna erro
  if (!session?.user?.id) {
    return {
      error: "Falha ao cadastrar lembrete",
    };
  }

  // Valida os dados do formulário com o schema definido acima
  const schema = formSchema.safeParse(formData);

  // Se os dados forem inválidos, retorna a primeira mensagem de erro
  if (!schema.success) {
    return {
      error: schema.error.issues[0].message,
    };
  }

  try {
    // Cria um novo lembrete no banco de dados com a descrição e o ID do usuário
    await prisma.reminder.create({
      data: {
        description: formData.description,
        userId: session?.user?.id,
      },
    });

    // Revalida a rota do dashboard para refletir o novo lembrete
    revalidatePath("/dashboard");

    // Retorna mensagem de sucesso
    return {
      data: "Lembrete cadastrado com sucesso!",
    };
  } catch (err) {
    // Em caso de erro, retorna uma mensagem de falha
    return {
      error: "Falha ao cadastrar lembrete",
    };
  }
}
