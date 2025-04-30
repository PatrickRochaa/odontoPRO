// Diretiva que define que essa função será executada no servidor (Server Actions do Next.js)
"use server";

// Importa a instância do Prisma ORM configurada no projeto
import prisma from "@/lib/prisma";

// Define a interface para os parâmetros esperados pela função `getUserData`
interface GetUserDataProps {
  userId: string; // ID do usuário a ser buscado
}

// Função assíncrona que busca os dados de um usuário no banco de dados com base no `userId`
export async function getUserData({ userId }: GetUserDataProps) {
  try {
    // Verifica se o ID do usuário foi fornecido
    if (!userId) {
      return null; // Retorna null se não houver ID (evita consulta inválida no banco)
    }

    // Consulta o banco de dados para encontrar o primeiro usuário com o ID correspondente
    const user = await prisma.user.findFirst({
      where: {
        id: userId, // Condição para buscar o usuário pelo ID
      },
      include: {
        subscription: true, // Inclui os dados da tabela de subscription relacionada a esse usuário
      },
    });

    // Se não encontrar o usuário, retorna null
    if (!user) {
      return null;
    }

    // Retorna os dados do usuário (incluindo subscription, se houver)
    return user;
  } catch (err) {
    // Em caso de erro na consulta ou execução, mostra no console e retorna null
    console.log(err);
    return null;
  }
}
