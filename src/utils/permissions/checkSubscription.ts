"use server"; // Indica que o código será executado no servidor.

import prisma from "@/lib/prisma"; // Importa o cliente Prisma para interagir com o banco de dados.
import { addDays, isAfter, differenceInDays } from "date-fns"; // Importa funções da biblioteca date-fns para manipulação de datas.
import { TRIAL_DAYS } from "@/utils/permissions/trial-limits"; // Importa o valor de dias do período de teste do arquivo de configurações.

export async function checkSubscription(userId: string) {
  // Busca o usuário no banco de dados com o Prisma, incluindo informações sobre a assinatura.
  const user = await prisma.user.findFirst({
    where: {
      id: userId, // Filtra o usuário pelo ID fornecido.
    },
    include: {
      subscription: true, // Inclui as informações de assinatura do usuário.
    },
  });

  // Se o usuário não for encontrado, lança um erro.
  if (!user) {
    throw new Error("Usuário nao encontrado"); // Mensagem de erro se o usuário não for encontrado no banco de dados.
  }

  // Se o usuário tem uma assinatura ativa, retorna o status de assinatura ativa.
  if (user.subscription && user.subscription.status === "active") {
    return {
      subscriptionStatus: "active", // Status da assinatura.
      message: "Assinatura ativa.", // Mensagem indicando que a assinatura está ativa.
      planId: user.subscription.plan, // Retorna o plano da assinatura ativa.
    };
  }

  // Calcula a data de término do período de teste baseado na data de criação do usuário e no limite de dias de teste.
  const trialEndDate = addDays(user.createdAt, TRIAL_DAYS);

  // Verifica se a data atual é posterior à data de término do período de teste.
  if (isAfter(new Date(), trialEndDate)) {
    return {
      subscriptionStatus: "EXPIRED", // Indica que o período de teste expirou.
      message: "Seu período de teste expirou.", // Mensagem informando que o período de teste expirou.
      planId: "TRIAL", // Retorna "TRIAL" para indicar que o usuário estava no período de teste.
    };
  }

  // Calcula quantos dias restantes há para o término do período de teste.
  const daysRemaining = differenceInDays(trialEndDate, new Date());

  // Se o usuário estiver dentro do período de teste, retorna o status do teste e os dias restantes.
  return {
    subscriptionStatus: "TRIAL", // Status indicando que o usuário ainda está no período de teste.
    message: `Você está no período de teste gratuito. Faltam ${daysRemaining} dias.`, // Mensagem com a contagem de dias restantes.
    planId: "TRIAL", // Retorna "TRIAL" indicando que o usuário está no plano de teste.
  };
}
