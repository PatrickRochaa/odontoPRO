// Indica que este código será executado no servidor (server-side)
"use server";

// Importa a instância do Prisma ORM para acessar o banco de dados
import prisma from "@/lib/prisma";

// Função assíncrona para buscar todos os serviços ativos de um usuário
export async function getAllServices({ userId }: { userId: string }) {
  // Verifica se o userId foi fornecido, se não, retorna erro
  if (!userId) {
    return {
      error: "Falha ao buscar serviços", // Mensagem de erro caso userId esteja ausente
    };
  }

  try {
    // Realiza a busca no banco de dados pelos serviços
    const services = await prisma.service.findMany({
      where: {
        userId: userId, // Filtra os serviços pelo ID do usuário
        status: true, // Apenas serviços com status ativo (true)
      },
    });

    // Retorna os serviços encontrados dentro da propriedade "data"
    return {
      data: services,
    };
  } catch (err) {
    // Em caso de erro na execução da query, retorna mensagem de erro
    return {
      error: "Falha ao buscar serviços",
    };
  }
}
