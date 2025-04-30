// Informa ao Next.js que essa função será executada no servidor
"use server";

// Importa a instância configurada do Prisma ORM
import prisma from "@/lib/prisma";

// Função assíncrona que recebe um objeto com userId e retorna os horários (times) da clínica
export async function getTimesClinic({ userId }: { userId: string }) {
  // Verifica se o userId foi fornecido; se não, retorna um objeto vazio padrão
  if (!userId) {
    return {
      times: [], // Nenhum horário retornado
      userId: "", // ID vazio
    };
  }

  try {
    // Busca no banco o usuário com o ID informado, retornando apenas o id e os horários cadastrados
    const user = await prisma.user.findFirst({
      where: {
        id: userId, // Filtro pelo ID do usuário
      },
      select: {
        id: true, // Retorna o ID
        times: true, // Retorna os horários relacionados ao usuário
      },
    });

    // Se o usuário não for encontrado, retorna objeto vazio padrão
    if (!user) {
      return {
        times: [],
        userId: "",
      };
    }

    // Se encontrado, retorna os horários (times) e o ID do usuário
    return {
      times: user.times,
      userId: user.id,
    };
  } catch (err) {
    // Em caso de erro (ex: falha de conexão com o banco), exibe no console e retorna padrão vazio
    console.log(err);
    return {
      times: [],
      userId: "",
    };
  }
}
