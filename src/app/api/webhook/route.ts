// Importações necessárias
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe } from "@/utils/stripe"; // Instância configurada do Stripe
import { manageSubscription } from "@/utils/manage-subscription"; // Função para lidar com criação/atualização de assinaturas
import { Plan } from "@prisma/client"; // Enum de planos definidos no banco (ex: BASIC, PREMIUM etc.)
import { revalidatePath } from "next/cache"; // Função do Next.js para revalidar páginas com cache

// Função que trata requisições POST (Webhook do Stripe)
export const POST = async (request: Request) => {
  // Obtém o header de assinatura enviado pelo Stripe
  const signature = request.headers.get("stripe-signature");

  // Se a assinatura não existir, retorna erro
  if (!signature) {
    return NextResponse.error();
  }

  console.log("WEBHOOK INICIANDO...");

  // Lê o corpo da requisição como texto bruto (necessário para validação da assinatura)
  const text = await request.text();

  // Constrói o evento usando o Stripe SDK e valida a assinatura
  const event = stripe.webhooks.constructEvent(
    text,
    signature,
    process.env.STRIPE_SECRET_WEBHOOK_KEY as string // Chave secreta do webhook
  );

  // Verifica o tipo do evento recebido e trata conforme necessário
  switch (event.type) {
    // Quando uma assinatura é cancelada
    case "customer.subscription.deleted":
      const payment = event.data.object as Stripe.Subscription;

      // Atualiza o status da assinatura no banco (cancelada)
      await manageSubscription(
        payment.id,
        payment.customer.toString(),
        false, // não é nova assinatura
        true // é cancelamento
      );

      break;

    // Quando uma assinatura é atualizada (ex: troca de plano, renovação)
    case "customer.subscription.updated":
      const paymentIntent = event.data.object as Stripe.Subscription;

      // Atualiza os dados da assinatura
      await manageSubscription(
        paymentIntent.id,
        paymentIntent.customer.toString(),
        false // não é nova
      );

      // Revalida a página de planos no dashboard
      revalidatePath("/dashboard/plans");

      break;

    // Quando o checkout é concluído com sucesso (nova assinatura criada)
    case "checkout.session.completed":
      const checkoutSession = event.data.object as Stripe.Checkout.Session;

      // Verifica o tipo de plano selecionado (se não houver, usa "BASIC")
      const type = checkoutSession?.metadata?.type
        ? checkoutSession?.metadata?.type
        : "BASIC";

      // Se os dados de assinatura e cliente estiverem disponíveis, registra nova assinatura
      if (checkoutSession.subscription && checkoutSession.customer) {
        await manageSubscription(
          checkoutSession.subscription.toString(),
          checkoutSession.customer.toString(),
          true, // é nova assinatura
          false, // não é cancelamento
          type as Plan
        );
      }

      // Revalida a página de planos
      revalidatePath("/dashboard/plans");

      break;

    // Caso o evento não esteja previsto nos casos acima
    default:
      console.log("Evento não tratado: ", event.type);
  }

  // Retorna resposta de sucesso para o Stripe
  return NextResponse.json({ received: true });
};
