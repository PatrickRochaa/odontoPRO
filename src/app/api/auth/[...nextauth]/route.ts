// Importa os manipuladores (handlers) de autenticação do NextAuth configurados no arquivo '@/lib/auth'
// Esses handlers lidam com requisições HTTP para login, logout, callbacks, etc.
import { handlers } from "@/lib/auth";

// Extrai os métodos GET e POST dos handlers para que o Next.js use automaticamente nas rotas da API
// Isso permite que o Next.js trate as requisições de autenticação corretamente
export const { GET, POST } = handlers;
