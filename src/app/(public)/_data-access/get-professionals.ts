// Indica que este arquivo usa uma Server Action no Next.js App Router
"use server";

// Importa a instância do Prisma Client para interagir com o banco de dados
import prisma from "@/lib/prisma";

// Função assíncrona responsável por buscar todos os profissionais ativos no sistema
export async function getProfessionals() {
  try {
    // Consulta no banco de dados todos os usuários (user) com status ativo (status: true)
    // Também inclui os dados de assinatura (subscription) relacionados a cada usuário
    const professionals = await prisma.user.findMany({
      where: {
        status: true, // Apenas usuários com status ativo
      },
      include: {
        subscription: true, // Inclui os dados da tabela de assinatura
      },
    });

    // Retorna a lista de profissionais encontrados
    return professionals;
  } catch (err) {
    // Em caso de erro (por exemplo, falha no banco), retorna um array vazio como fallback
    return [];
  }
}
