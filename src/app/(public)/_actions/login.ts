// Declara que esse arquivo é um Server Action do Next.js App Router
"use server";

// Importa a função `signIn` do módulo de autenticação customizado (provavelmente baseado no NextAuth)
import { signIn } from "@/lib/auth";

// Define um tipo chamado LoginType que só aceita dois valores possíveis: "google" ou "github"
// Isso serve para limitar os provedores de login permitidos na função abaixo
type LoginType = "google" | "github";

// Função assíncrona que lida com o login/registro de um usuário com base no provedor (Google ou GitHub)
export async function handleRegister(provider: LoginType) {
  // Chama a função `signIn` com o provedor escolhido e redireciona o usuário para o /dashboard após o login
  await signIn(provider, { redirectTo: "/dashboard" });
}
