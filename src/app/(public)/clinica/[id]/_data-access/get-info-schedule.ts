"use server";
// Indica que esse código roda no servidor (Server Actions do Next.js)

import prisma from "@/lib/prisma";
// Importa a instância do Prisma para interagir com o banco de dados

// Função assíncrona que busca informações de um usuário (clínica) baseado no ID
export async function getInfoSchedule({ userId }: { userId: string }) {
  try {
    // Verifica se o ID do usuário foi fornecido
    if (!userId) {
      return null; // Se não tiver ID, retorna null (não tem como buscar)
    }

    // Busca o usuário no banco de dados
    const user = await prisma.user.findFirst({
      where: {
        id: userId, // Filtra pelo ID do usuário recebido
      },
      include: {
        subscription: true, // Inclui dados da assinatura (caso exista)
        services: {
          where: {
            status: true, // Filtra apenas os serviços ativos (status: true)
          },
        },
      },
    });

    // Se não encontrar o usuário, retorna null
    if (!user) {
      return null;
    }

    // Caso tudo ocorra bem, retorna os dados do usuário (com subscription e serviços ativos)
    return user;
  } catch (err) {
    // Se ocorrer algum erro na busca, ele será silenciosamente ignorado (poderia ser tratado ou logado aqui)
  }
}
