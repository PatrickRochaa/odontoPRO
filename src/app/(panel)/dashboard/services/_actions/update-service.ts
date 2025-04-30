// Indica que este código será executado no servidor (server action)
"use server";

// Importa função para autenticação do usuário
import { auth } from "@/lib/auth";
// Importa o Prisma Client para acesso ao banco de dados
import prisma from "@/lib/prisma";
// Importa o Zod para validação de dados
import { z } from "zod";
// Importa função do Next.js que revalida o cache da página (útil para SSR/ISR)
import { revalidatePath } from "next/cache";

// Define o schema do formulário usando Zod para validar os dados enviados
const formSchema = z.object({
  serviceId: z.string().min(1, "O id do serviço é obrigatório"), // ID do serviço deve ser preenchido
  name: z.string().min(1, { message: "O nome do serviço é obrigatório" }), // Nome obrigatório
  price: z.number().min(1, { message: "O preço do serviço é obrigatório" }), // Preço obrigatório
  duration: z.number(), // Duração pode ser qualquer número (validação extra no código)
});

// Cria o tipo TypeScript baseado no schema do formulário
type FromSchema = z.infer<typeof formSchema>;

// Função assíncrona que atualiza os dados de um serviço
export async function updateService(formData: FromSchema) {
  // Autentica o usuário atual
  const session = await auth();

  // Verifica se o usuário está autenticado
  if (!session?.user?.id) {
    return {
      error: "Falha ao atualizar serviço", // Retorna erro se o usuário não estiver logado
    };
  }

  // Valida os dados recebidos com o schema do Zod
  const schema = formSchema.safeParse(formData);

  // Se a validação falhar, retorna a primeira mensagem de erro
  if (!schema.success) {
    return {
      error: schema.error.issues[0].message,
    };
  }

  try {
    // Atualiza o serviço no banco de dados usando o Prisma
    await prisma.service.update({
      where: {
        id: formData.serviceId, // ID do serviço a ser atualizado
        userId: session?.user?.id, // Garante que o serviço pertence ao usuário logado
      },
      data: {
        name: formData.name, // Atualiza o nome do serviço
        price: formData.price, // Atualiza o preço
        // Garante que a duração mínima seja 30 (caso valor seja menor, define como 30)
        duration: formData.duration < 30 ? 30 : formData.duration,
      },
    });

    // Revalida a rota para atualizar a lista de serviços no dashboard
    revalidatePath("/dashboard/services");

    // Retorna mensagem de sucesso
    return {
      data: "Serviço atualizado com sucesso",
    };
  } catch (err) {
    // Em caso de erro no processo de atualização, mostra no console e retorna mensagem de erro
    console.log(err);
    return {
      error: "Falha ao atualizar serviço",
    };
  }
}
