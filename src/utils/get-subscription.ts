// Indica que esta função será executada no servidor (Next.js com "use server")
"use server";

import prisma from "@/lib/prisma"; // Importa a instância do Prisma Client para realizar consultas no banco de dados

// Função assíncrona que busca a assinatura (subscription) de um usuário com base no ID fornecido
export async function getSubscription({ userId }: { userId: string }) {
  // Se o ID do usuário não for fornecido, retorna null imediatamente
  if (!userId) {
    return null;
  }

  try {
    // Busca a primeira assinatura encontrada no banco de dados que corresponda ao userId
    const subscription = await prisma.subscription.findFirst({
      where: {
        userId: userId, // Condição de busca: userId deve ser igual ao informado
      },
    });

    // Retorna a assinatura encontrada (pode ser um objeto ou null)
    return subscription;
  } catch (err) {
    // Em caso de erro na consulta (por exemplo, falha na conexão com o banco), retorna null
    return null;
  }
}
