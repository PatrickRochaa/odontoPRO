// Marca o componente como client-side (necessário para hooks como useState, useSession etc.)
"use client";

// Importa hooks e componentes necessários
import { useState } from "react"; // Gerenciar estado local
import Link from "next/link"; // Navegação entre páginas
import {
  Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger
} from "@/components/ui/sheet"; // Componente de menu lateral (mobile)
import { Button } from "../../../components/ui/button"; // Componente de botão personalizado
import { LogIn, Menu } from "lucide-react"; // Ícones do Lucide (LogIn e Menu)
import { useSession } from "next-auth/react"; // Hook para acessar sessão do usuário logado
import { handleRegister } from "../_actions/login"; // Função para login via Google

// Componente principal do cabeçalho
export function Header() {
  // Obtém os dados da sessão e o status (carregando, autenticado ou não autenticado)
  const { data: session, status } = useSession();

  // Estado local para controlar abertura do menu lateral (mobile)
  const [isOpen, setIsOpen] = useState(false);

  // Lista de itens do menu de navegação
  const navItems = [{ href: "#profissionais", label: "Profissionais" }];

  // Função de login com Google
  async function handleLogin() {
    await handleRegister("google");
  }

  // Componente que renderiza os links de navegação + botão de login ou dashboard
  const NavLinks = () => (
    <>
      {/* Mapeia os itens da navegação (ex: "Profissionais") */}
      {navItems.map((item) => (
        <Button
          onClick={() => setIsOpen(false)} // Fecha o menu mobile ao clicar no link
          key={item.href}
          asChild
          className="bg-transparent hover:bg-transparent text-black shadow-none"
        >
          <Link href={item.href} className="text-base">
            {item.label}
          </Link>
        </Button>
      ))}

      {/* Renderiza botão de login ou link para dashboard, dependendo da sessão */}
      {status === "loading" ? (
        <></> // Não renderiza nada enquanto carrega
      ) : session ? (
        // Se estiver logado, mostra botão para acessar o dashboard
        <Link
          href="/dashboard"
          className="flex items-center justify-center gap-2 bg-zinc-900 text-white py-1 rounded-md px-4"
        >
          Acessar clínica
        </Link>
      ) : (
        // Se não estiver logado, mostra botão para login com Google
        <Button onClick={handleLogin} className="cursor-pointer">
          <LogIn />
          Portal da clínica
        </Button>
      )}
    </>
  );

  return (
    // Cabeçalho fixo no topo com fundo branco
    <header className="fixed top-0 right-0 left-0 z-[999] py-4 px-6 bg-white">
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo da aplicação com link para a home */}
        <Link href="/" className="text-3xl font-bold text-zinc-900">
          Odonto<span className="text-emerald-500">PRO</span>
        </Link>

        {/* Menu visível apenas em telas médias (md) ou maiores */}
        <nav className="hidden md:flex items-center space-x-4">
          <NavLinks />
        </nav>

        {/* Menu lateral mobile utilizando Sheet */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          {/* Botão que dispara o menu lateral no mobile */}
          <SheetTrigger asChild className="md:hidden cursor-pointer">
            <Button
              className="text-black hover:bg-transparent"
              variant="ghost"
              size="icon"
            >
              <Menu className="w-6 h-6" /> {/* Ícone do menu (hambúrguer) */}
            </Button>
          </SheetTrigger>

          {/* Conteúdo do menu lateral (abertura pela direita) */}
          <SheetContent
            side="right"
            className="w-[240px] sm:w-[300px] z-[9999]"
          >
            <div className="flex flex-col gap-1 p-2.5">
              {/* Título e descrição do menu */}
              <SheetTitle>Menu</SheetTitle>
              <SheetDescription>Veja nossos links</SheetDescription>
            </div>

            {/* Navegação no menu lateral */}
            <nav className="flex flex-col space-y-4 px-1">
              <NavLinks />
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
