// Importa o tipo `Metadata` do Next.js para definir metadados da página
import type { Metadata } from "next";

// Importa as fontes Geist e Geist_Mono do Google Fonts via Next.js
import { Geist, Geist_Mono } from "next/font/google";

// Importa os estilos globais do projeto
import "./globals.css";

// Importa o provedor de autenticação da sessão do usuário (provavelmente do NextAuth)
import { SessionAuthProvider } from "@/components/session-auth";

// Importa o `Toaster` da biblioteca `sonner`, responsável por exibir notificações na tela
import { Toaster } from "sonner";

// Importa o provedor do React Query, que gerencia requisições assíncronas e cache
import { QueryClientContext } from "@/providers/queryclient";

// Carrega a fonte Geist Sans e define uma variável CSS para uso global no Tailwind/CSS
const geistSans = Geist({
  variable: "--font-geist-sans", // Variável CSS para utilizar essa fonte
  subsets: ["latin"], // Define os caracteres suportados (ex: acentos, etc.)
});

// Carrega a fonte Geist Mono (versão monoespaçada) com variável CSS
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Define os metadados globais do site, como título e descrição
export const metadata: Metadata = {
  title: "OdontoPRO - Encontre os melhores profissionais em um único local.", // Título padrão da página
  description: "Nós somos uma plataforma para profissionais da saúde com foco em agilizar seu atendimento de forma simples e organizada.", // Descrição do site (SEO)
  robots: {
    index: true,
    follow: true,
    nocache: true,
  },
  openGraph: {
    title: "OdontoPRO - Encontre os melhores profissionais em um único local.", // Título padrão da página
    description: "Nós somos uma plataforma para profissionais da saúde com foco em agilizar seu atendimento de forma simples e organizada.",
    images: [`${process.env.NEXT_PUBLIC_URL}/logo-odonto.png`]
  }
};

// Componente RootLayout que define a estrutura base do HTML
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode; // Define que `children` pode conter qualquer elemento React
}>) {
  return (
    // Define a estrutura do documento HTML
    <html lang="pt-Br"> {/* Define o idioma da página para português do Brasil */}
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Provedor de autenticação da sessão */}
        <SessionAuthProvider>
          {/* Provedor do React Query para gerenciar cache de requisições */}
          <QueryClientContext>
            {/* Componente de notificações (toasts) */}
            <Toaster duration={2500} richColors />
            {/* Renderiza os componentes filhos que são passados para o layout */}
            {children}
          </QueryClientContext>
        </SessionAuthProvider>
      </body>
    </html>
  );
}
