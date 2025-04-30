// Importa o pacote oficial do Stripe para Node.js, que é utilizado para integrar com a API do Stripe
import Stripe from "stripe";

// Cria uma instância do cliente Stripe com a chave secreta da sua conta Stripe (definida nas variáveis de ambiente).
// A chave secreta é usada para realizar operações no backend, como criação de cobranças, gerenciamento de assinaturas, etc.
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  // Define a versão da API do Stripe a ser usada. A versão especificada ajuda a garantir que a API se comporte da mesma forma,
  // mesmo que novas versões sejam lançadas pela Stripe, evitando quebras inesperadas de funcionalidade.
  apiVersion: "2025-03-31.basil",
});
