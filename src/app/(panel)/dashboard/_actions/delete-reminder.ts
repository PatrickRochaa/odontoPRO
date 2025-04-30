"use server"; // Informa ao Next.js que essa função será executada no lado do servidor

// Importa o cliente Prisma para interagir com o banco de dados
import prisma from "@/lib/prisma";

// Importa o Zod, uma biblioteca para validação de dados
import { z } from "zod";

// Importa função do Next.js para revalidar cache de rotas (ISR ou Server Actions)
import { revalidatePath } from "next/cache";

// Define o esquema de validação para os dados recebidos
const formSchema = z.object({
  reminderId: z
    .string({
      errorMap: () => ({ message: "O id do lembrete é obrigatório" }), // Mensagem personalizada para erro
    })
    .min(1, "O id do lembrete é obrigatório"), // Garante que o ID não esteja vazio
});

// Cria um tipo TypeScript a partir do schema
type FormSchema = z.infer<typeof formSchema>;

// Função assíncrona responsável por deletar um lembrete
export async function deleteReminder(formData: FormSchema) {
  // Valida os dados recebidos com base no schema
  const schema = formSchema.safeParse(formData);

  // Se a validação falhar, retorna o primeiro erro encontrado
  if (!schema.success) {
    return {
      error: schema.error.issues[0].message,
    };
  }

  try {
    // Deleta o lembrete com base no ID fornecido
    await prisma.reminder.delete({
      where: {
        id: formData.reminderId,
      },
    });

    // Revalida a página do dashboard para refletir a exclusão
    revalidatePath("/dashboard");

    // Retorna uma mensagem de sucesso
    return {
      data: "Lembrete deletado com sucesso",
    };
  } catch (err) {
    // Caso ocorra um erro no processo, retorna mensagem de erro
    return {
      error: "Não foi possível deletar o lembrete.",
    };
  }
}
