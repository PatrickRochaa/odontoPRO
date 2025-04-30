// Informa ao Next.js que esta função será executada apenas no servidor
"use server";

// Importações necessárias
import prisma from "@/lib/prisma"; // Instância do Prisma ORM
import { z } from "zod"; // Biblioteca para validação de esquemas
import { revalidatePath } from "next/cache"; // Função para revalidar cache de rotas
import { auth } from "@/lib/auth"; // Função para obter sessão do usuário autenticado

// Define o esquema de validação dos dados usando Zod
const formSchema = z.object({
  appointmentId: z.string().min(1, "Você precisa fornecer um agendamento"), // Campo obrigatório
});

// Tipo TypeScript baseado no schema acima
type FormSchema = z.infer<typeof formSchema>;

// Função assíncrona responsável por cancelar um agendamento
export async function cancelAppointment(formData: FormSchema) {
  // Valida os dados do formulário com base no schema definido
  const schema = formSchema.safeParse(formData);

  // Se houver erro na validação, retorna a mensagem de erro
  if (!schema.success) {
    return {
      error: schema.error.issues[0]?.message,
    };
  }

  // Obtém a sessão do usuário autenticado
  const session = await auth();

  // Se não houver sessão ou ID do usuário, retorna erro
  if (!session?.user?.id) {
    return {
      error: "Usuário não encontrado",
    };
  }

  try {
    // Tenta deletar o agendamento do banco, validando também se pertence ao usuário logado
    await prisma.appointment.delete({
      where: {
        id: formData.appointmentId, // ID do agendamento
        userId: session.user?.id, // Garante que o agendamento pertence ao usuário
      },
    });

    // Após o cancelamento, revalida a rota do dashboard para atualizar os dados
    revalidatePath("/dashboard");

    // Retorna sucesso
    return {
      data: "Agendamento cancelado com sucesso",
    };
  } catch (err) {
    // Em caso de erro (ex: agendamento não encontrado ou erro no banco), retorna mensagem de erro
    return {
      error: "Ocorreu um erro ao deletar este agendamento.",
    };
  }
}
