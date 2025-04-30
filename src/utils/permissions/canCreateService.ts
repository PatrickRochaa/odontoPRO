// Define que este código será executado no lado do servidor (Next.js 13+)
"use server";

// Importações dos recursos necessários
import prisma from "@/lib/prisma"; // ORM Prisma para acessar o banco de dados
import { Subscription } from "@prisma/client"; // Tipo da assinatura vinda do Prisma
import { Session } from "next-auth"; // Tipo de sessão do usuário logado via NextAuth
import { getPlan } from "./get-plans"; // Função que retorna os limites de cada plano
import { PLANS } from "../plans"; // Objeto com os detalhes dos planos disponíveis
import { checkSubscriptionExpired } from "@/utils/permissions/checkSubscriptionExpired"; // Verifica se a assinatura expirou
import { ResultPermissionProp } from "./canPermission"; // Tipo do retorno esperado da função

// Função assíncrona que verifica se o usuário pode criar um novo serviço
// Recebe como parâmetros: a assinatura atual do usuário e a sessão de login
export async function canCreateService(
  subscription: Subscription | null,
  session: Session
): Promise<ResultPermissionProp> {
  try {
    // Conta quantos serviços o usuário já criou com base no ID da sessão
    const serviceCount = await prisma.service.count({
      where: {
        userId: session?.user?.id, // Garante que está usando o ID do usuário logado
        status: true,
      },
    });

    // Se o usuário tiver uma assinatura ativa
    if (subscription && subscription.status === "active") {
      const plan = subscription.plan; // Recupera o plano da assinatura
      const planLimits = await getPlan(plan); // Busca os limites definidos para o plano

      console.log("LIMITES DO SEU PLANO: ", planLimits);

      return {
        // Verifica se o usuário ainda pode criar serviços baseado no plano
        hasPermission:
          planLimits.maxServices === null ||
          serviceCount < planLimits.maxServices,
        planId: subscription.plan,
        expired: false,
        plan: PLANS[subscription.plan], // Pega as informações detalhadas do plano atual
      };
    }

    // Caso não tenha uma assinatura ativa, verifica se a assinatura está expirada
    const checkUserLimit = await checkSubscriptionExpired(session);

    // Retorna o resultado da verificação (com permissão ou não)
    return checkUserLimit;
  } catch (err) {
    // Em caso de erro (ex: falha na consulta), retorna uma resposta padrão sem permissão
    return {
      hasPermission: false,
      planId: "EXPIRED",
      expired: false,
      plan: null,
    };
  }
}
