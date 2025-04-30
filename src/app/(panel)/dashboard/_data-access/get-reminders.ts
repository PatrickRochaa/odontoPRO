// Indica que essa função será executada no servidor (Next.js - App Router)
"use server";

// Importa a instância do Prisma para acessar o banco de dados
import prisma from "@/lib/prisma";

// Função assíncrona que busca todos os lembretes de um usuário específico
export async function getReminders({ userId }: { userId: string }) {
  // Se nenhum ID de usuário for fornecido, retorna um array vazio
  if (!userId) {
    return [];
  }

  try {
    // Busca no banco todos os lembretes cadastrados para o usuário informado
    const reminders = await prisma.reminder.findMany({
      where: {
        userId: userId, // Filtra pelo ID do usuário
      },
    });

    // Retorna os lembretes encontrados
    return reminders;
  } catch (err) {
    // Em caso de erro, exibe o erro no console e retorna array vazio
    console.log(err);
    return [];
  }
}
