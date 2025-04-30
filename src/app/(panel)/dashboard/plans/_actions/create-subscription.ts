"use server"; // Indica que esta função será executada no lado do servidor (Server Actions do Next.js)

// Importações de autenticação, banco de dados e Stripe
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { stripe } from "@/utils/stripe";

// Enum de planos disponíveis (BASIC ou PROFESSIONAL) vindo do Prisma
import { Plan } from "@prisma/client";

// Tipagem esperada para a função: recebe um objeto com o tipo do plano
interface SubscriptionProps {
  type: Plan;
}

// Função responsável por iniciar o processo de assinatura via Stripe
export async function createSubscription({ type }: SubscriptionProps) {
  // Recupera a sessão do usuário autenticado
  const session = await auth();
  const userId = session?.user?.id;

  // Verifica se o usuário está logado
  if (!userId) {
    return {
      sessionId: "",
      error: "Falha ao ativar plano.",
    };
  }

  // Busca o usuário no banco de dados
  const findUser = await prisma.user.findFirst({
    where: {
      id: userId,
    },
  });

  // Se não encontrar o usuário, retorna erro
  if (!findUser) {
    return {
      sessionId: "",
      error: "Falha ao ativar plano.",
    };
  }

  // Verifica se o usuário já possui um ID de cliente na Stripe
  let customerId = findUser.stripe_customer_id;

  // Caso ainda não tenha, cria um novo cliente na Stripe
  if (!customerId) {
    const stripeCustomer = await stripe.customers.create({
      email: findUser.email, // Define o email do usuário como identificador na Stripe
    });

    // Atualiza o usuário no banco com o novo stripe_customer_id
    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        stripe_customer_id: stripeCustomer.id,
      },
    });

    customerId = stripeCustomer.id; // Salva o ID do novo cliente
  }

  // Inicia o processo de criação de sessão de pagamento (checkout) na Stripe
  try {
    const stripeCheckoutSession = await stripe.checkout.sessions.create({
      customer: customerId, // ID do cliente na Stripe
      payment_method_types: ["card"], // Aceita apenas cartão de crédito
      billing_address_collection: "required", // Exige o endereço de cobrança
      line_items: [
        {
          price:
            type === "BASIC"
              ? process.env.STRIPE_PLAN_BASIC // Usa o ID do plano BASIC se for escolhido
              : process.env.STRIPE_PLAN_PROFESSIONAL, // Caso contrário, o plano PROFESSIONAL
          quantity: 1, // Apenas uma assinatura por vez
        },
      ],
      metadata: {
        type: type, // Salva o tipo de plano como metadado
      },
      mode: "subscription", // Define que o pagamento será por assinatura
      allow_promotion_codes: true, // Permite cupons de desconto
      success_url: process.env.STRIPE_SUCCESS_URL, // Redirecionamento após sucesso
      cancel_url: process.env.STRIPE_CANCEL_URL, // Redirecionamento após cancelamento
    });

    // Retorna o ID da sessão para que o front-end possa redirecionar o usuário
    return {
      sessionId: stripeCheckoutSession.id,
    };
  } catch (err) {
    // Em caso de erro, mostra no console e retorna uma mensagem genérica
    console.log("ERRO AO CRIAR CHECKOUT");
    console.log(err);
    return {
      sessionId: "",
      error: "Falha ao ativar plano.",
    };
  }
}
