// Importa a interface `DefaultSession` do NextAuth para estender a definição do tipo `Session`
import { DefaultSession } from "next-auth";

// Declaração de módulo para estender as definições do NextAuth, permitindo que você personalize o tipo da `Session`
// Isso permite que o `user` na sessão tenha as propriedades que você definir (como o tipo `User` abaixo)
declare module "next-auth" {
  interface Session {
    // Personaliza o tipo de `user` para incluir as propriedades adicionais definidas na interface `User`
    user: User & DefaultSession["user"];
  }
}

// Define a interface `User` que representa um usuário autenticado na aplicação, com propriedades personalizadas
interface User {
  id: string; // ID único do usuário
  name: string; // Nome completo do usuário
  email: string; // E-mail do usuário
  emailVerified?: null | string | boolean; // Indica se o e-mail do usuário foi verificado
  image?: string; // URL da imagem de perfil do usuário (opcional)
  stripe_customer_id?: string; // ID do cliente no Stripe, usado para associar o usuário com a Stripe
  times: string[]; // Array de strings representando horários ou dados adicionais do usuário
  address?: string; // Endereço do usuário (opcional)
  phone?: string; // Número de telefone do usuário (opcional)
  status: boolean; // Status ativo/inativo do usuário
  createdAt: string; // Data de criação da conta do usuário
  updatedAt: string; // Data da última atualização dos dados do usuário
}
