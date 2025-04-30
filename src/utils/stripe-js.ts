// Importa a função `loadStripe` do pacote oficial do Stripe para frontend (Stripe.js)
import { loadStripe } from "@stripe/stripe-js";

/**
 * Função assíncrona que carrega e retorna a instância do Stripe.js,
 * utilizando a chave pública da sua conta Stripe (definida nas variáveis de ambiente).
 */
export async function getStripeJs() {
  // Carrega o Stripe.js com a chave pública fornecida pelo ambiente (NEXT_PUBLIC_STRIPE_PUBLIC_KEY)
  // Essa chave é segura para uso no frontend, pois é pública
  const stripeJs = await loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY as string
  );

  // Retorna a instância carregada do Stripe, pronta para uso em operações como redirecionamento para checkout
  return stripeJs;
}
