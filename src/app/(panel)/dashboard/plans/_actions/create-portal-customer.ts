"use server"; // Indica que esta função será executada no lado do servidor (Server Actions do Next.js)

// Importa a função de autenticação personalizada
import { auth } from "@/lib/auth";

// Importa o cliente do Prisma para interação com o banco de dados
import prisma from "@/lib/prisma";

// Importa o cliente Stripe configurado para uso com a API de pagamentos
import { stripe } from "@/utils/stripe";

// Função responsável por criar uma sessão no portal de faturamento da Stripe
export async function createPortalCustomer() {
  // Recupera a sessão do usuário autenticado
  const session = await auth();

  // Verifica se o usuário está autenticado (ou seja, se possui ID na sessão)
  if (!session?.user?.id) {
    return {
      sessionId: "",
      error: "Usuário não encontrado",
    };
  }

  // Busca o usuário no banco de dados usando o ID da sessão
  const user = await prisma.user.findFirst({
    where: {
      id: session?.user?.id,
    },
  });

  // Caso o usuário não seja encontrado no banco de dados
  if (!user) {
    return {
      sessionId: "",
      error: "Usuário não encontrado",
    };
  }

  // Obtém o ID do cliente Stripe vinculado ao usuário
  const sessionId = user.stripe_customer_id;

  // Verifica se o usuário possui um ID de cliente Stripe registrado
  if (!sessionId) {
    return {
      sessionId: "",
      error: "Usuário não encontrado",
    };
  }

  try {
    // Cria uma sessão no portal de faturamento da Stripe para o cliente
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: sessionId, // ID do cliente Stripe
      return_url: process.env.STRIPE_SUCCESS_URL as string, // URL para redirecionar após o uso do portal
    });

    // Retorna a URL do portal Stripe para o front-end abrir
    return {
      sessionId: portalSession.url,
    };
  } catch (err) {
    // Caso ocorra erro ao criar a sessão, exibe o erro no console
    console.log("ERRO AO CRIAR PORTAL: ", err);

    // Retorna erro para o front-end
    return {
      sessionId: "",
      error: "Usuário não encontrado",
    };
  }
}
