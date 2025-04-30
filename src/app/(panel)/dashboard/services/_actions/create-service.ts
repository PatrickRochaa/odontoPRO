// Define que este arquivo será executado no lado do servidor
"use server";

// Importa a função de autenticação personalizada
import { auth } from "@/lib/auth";
// Importa a instância do Prisma para interagir com o banco de dados
import prisma from "@/lib/prisma";
// Importa o Zod para validação de dados
import { z } from "zod";
// Importa a função do Next.js para revalidar cache de rotas
import { revalidatePath } from "next/cache";

// Define o schema de validação dos dados do formulário com o Zod
const formSchema = z.object({
  // Campo 'name' deve ser uma string e não pode estar vazia
  name: z.string().min(1, { message: "O nome do serviço é obrigatório" }),
  // Campo 'price' deve ser um número e deve ser maior que zero
  price: z.number().min(1, { message: "O preço do serviço é obrigatório" }),
  // Campo 'duration' deve ser um número (tempo de duração do serviço)
  duration: z.number(),
});

// Cria um tipo TypeScript com base no schema do formulário
type FromSchema = z.infer<typeof formSchema>;

// Função assíncrona que cria um novo serviço no banco de dados
export async function createNewService(formData: FromSchema) {
  // Obtém a sessão do usuário autenticado
  const session = await auth();

  // Se não houver sessão ou id do usuário, retorna erro
  if (!session?.user?.id) {
    return {
      error: "Falha ao cadastra serviço", // erro de autenticação
    };
  }

  // Valida os dados recebidos com base no schema definido
  const schema = formSchema.safeParse(formData);

  // Se a validação falhar, retorna o primeiro erro encontrado
  if (!schema.success) {
    return {
      error: schema.error.issues[0].message,
    };
  }

  try {
    // Cria um novo serviço no banco de dados com os dados fornecidos
    const newService = await prisma.service.create({
      data: {
        name: formData.name,
        price: formData.price,
        duration: formData.duration,
        userId: session?.user?.id, // relaciona o serviço ao usuário logado
      },
    });

    // Revalida (atualiza) a rota do dashboard de serviços para mostrar o novo
    revalidatePath("/dashboard/services");

    // Retorna os dados do novo serviço criado com sucesso
    return {
      data: newService,
    };
  } catch (err) {
    // Caso ocorra algum erro na criação do serviço, exibe no console e retorna erro
    console.log(err);
    return {
      error: "Falha ao cadastra serviço",
    };
  }
}
