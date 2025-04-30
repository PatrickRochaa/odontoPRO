// Indica que este código será executado no servidor (server actions do Next.js)
"use server";

// Importa função de autenticação personalizada para verificar se o usuário está logado
import { auth } from "@/lib/auth";
// Importa o Prisma para acessar o banco de dados
import prisma from "@/lib/prisma";
// Importa o Zod para fazer a validação dos dados do formulário
import { z } from "zod";
// Importa função do Next.js para revalidar (atualizar) o cache da rota
import { revalidatePath } from "next/cache";

// Define o schema de validação usando Zod
const formSchema = z.object({
  // O campo serviceId é obrigatório e deve ser uma string com pelo menos 1 caractere
  serviceId: z.string().min(1, { message: "O ID do serviço é obrigatório" }),
});

// Cria um tipo TypeScript baseado no schema do formulário
type FromSchema = z.infer<typeof formSchema>;

// Função assíncrona para deletar (na verdade, desativar) um serviço
export async function deleteService(formData: FromSchema) {
  // Obtém os dados da sessão do usuário logado
  const session = await auth();

  // Verifica se o usuário está logado (tem um ID de usuário)
  if (!session?.user?.id) {
    return {
      error: "Falha ao deletar serviço", // Retorna erro se o usuário não estiver autenticado
    };
  }

  // Faz a validação dos dados recebidos com o schema
  const schema = formSchema.safeParse(formData);

  // Se a validação falhar, retorna a primeira mensagem de erro encontrada
  if (!schema.success) {
    return {
      error: schema.error.issues[0].message,
    };
  }

  try {
    // Atualiza o serviço no banco de dados:
    // Marca o serviço como inativo (status: false) ao invés de deletar de fato
    await prisma.service.update({
      where: {
        id: formData.serviceId, // ID do serviço enviado pelo formulário
        userId: session?.user?.id, // Garante que o serviço pertence ao usuário logado
      },
      data: {
        status: false, // Marca o serviço como "desativado"
      },
    });

    // Revalida a rota para que a lista de serviços no dashboard seja atualizada em tempo real
    revalidatePath("/dashboard/services");

    // Retorna mensagem de sucesso
    return {
      data: "Serviço deletado com sucesso!",
    };
  } catch (err) {
    // Caso aconteça algum erro durante a operação, retorna mensagem de erro
    return {
      error: "Falha ao deletar serviço",
    };
  }
}
