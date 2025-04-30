// Importa o client do Prisma para acessar o banco de dados
import prisma from "@/lib/prisma";

// Importa o construtor de tipos do Stripe
import Stripe from "stripe";
// Importa a instância já configurada do Stripe
import { stripe } from "@/utils/stripe";
// Importa o tipo "Plan" do Prisma (BASIC, PROFESSIONAL, etc.)
import { Plan } from "@prisma/client";

/**
 * Função para gerenciar assinaturas (criar, atualizar ou deletar) no banco de dados,
 * sincronizando com as informações da API do Stripe.
 *
 * @param subscriptionId - ID da assinatura no Stripe
 * @param customerId - ID do cliente no Stripe
 * @param createAction - Define se é uma nova assinatura (true para criar)
 * @param deleteAction - Define se a assinatura deve ser deletada (true para deletar)
 * @param type - Tipo de plano (BASIC, PROFESSIONAL, etc.), usado na criação da assinatura
 */
export async function manageSubscription(
  subscriptionId: string,
  customerId: string,
  createAction = false,
  deleteAction = false,
  type?: Plan
) {
  // Busca o usuário no banco pelo ID do cliente no Stripe
  const findUser = await prisma.user.findFirst({
    where: {
      stripe_customer_id: customerId,
    },
  });

  // Se o usuário não for encontrado, retorna erro
  if (!findUser) {
    return Response.json(
      { error: "Falha ao realizar assinatura" },
      { status: 400 }
    );
  }

  // Busca os dados da assinatura diretamente da API do Stripe
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);

  // Prepara os dados da assinatura para serem salvos/atualizados no banco
  const subscriptionData = {
    id: subscription.id,
    userId: findUser.id,
    status: subscription.status,
    priceId: subscription.items.data[0].price.id,
    plan: type ?? "BASIC", // Se o plano não for informado, usa BASIC como padrão
  };

  // Se for uma requisição para deletar a assinatura
  if (subscriptionId && deleteAction) {
    await prisma.subscription.delete({
      where: {
        id: subscriptionId,
      },
    });

    return; // Encerra a execução após a exclusão
  }

  // Se for uma requisição para criar uma nova assinatura
  if (createAction) {
    try {
      await prisma.subscription.create({
        data: subscriptionData,
      });
    } catch (err) {
      console.log("ERRO AO SALVAR NO BANCO A ASSINATURA");
      console.log(err); // Exibe erro no terminal
    }
  } else {
    // Caso contrário, tenta atualizar uma assinatura existente
    try {
      // Busca a assinatura no banco pelo ID
      const findSubscription = await prisma.subscription.findFirst({
        where: {
          id: subscriptionId,
        },
      });

      // Se não encontrar assinatura, sai da função
      if (!findSubscription) return;

      // Atualiza os dados da assinatura no banco
      await prisma.subscription.update({
        where: {
          id: findSubscription.id,
        },
        data: {
          status: subscription.status,
          priceId: subscription.items.data[0].price.id,
        },
      });
    } catch (err) {
      console.log("FALHA AO ATUALIZAR ASSINATURA NO BANCO");
      console.log(err); // Exibe erro no terminal
    }
  }
}
