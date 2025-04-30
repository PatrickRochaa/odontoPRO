"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  Banknote,
  CalendarCheck2,
  ChevronLeft,
  ChevronRight,
  Folder,
  List,
  Settings,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import logoImg from "../../../../../public/logo-odonto.png";
import { SidebarLogoutButton } from "./SidebarLogoutButton";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

export function SidebarDashboard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname(); // Obtém o caminho atual da rota
  const [isCollapsed, setIsCollapsed] = useState(false); // Estado para controle do menu recolhido ou expandido
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Estado do menu no mobile

  // Função para fechar o menu ao clicar em um link
  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <div className="flex min-h-screen w-full">
      {/* Barra lateral */}
      <aside
        className={clsx(
          "flex flex-col border-r bg-background transition-all duration-300 p-4 h-full",
          {
            "w-20": isCollapsed, // Define a largura da sidebar quando está recolhida
            "w-64": !isCollapsed, // Define a largura da sidebar quando está expandida
            "hidden md:flex md:fixed": true, // Esconde a sidebar em dispositivos móveis e fixa em telas maiores
          }
        )}
      >
        {/* Logo da aplicação */}
        <div className="mb-6 mt-4">
          {/* Exibe a logo apenas se a sidebar não estiver recolhida */}
          {!isCollapsed && (
            <Image
              src={logoImg}
              alt="Logo do odontopro"
              priority
              quality={100}
            />
          )}
        </div>
        {/* Botão para recolher/expandir a sidebar */}
        <Button
          className="bg-gray-100 hover:bg-gray-50 text-zinc-900 self-end mb-2"
          onClick={() => setIsCollapsed(!isCollapsed)} // Alterna entre recolher e expandir a sidebar
        >
          {/* Ícone muda conforme o estado da sidebar */}
          {!isCollapsed ? (
            <ChevronLeft className="w-12 h-12" />
          ) : (
            <ChevronRight className="w-12 h-12" />
          )}
        </Button>
        {/* Navegação quando a sidebar está recolhida */}
        {isCollapsed && (
          <nav className="flex flex-col gap-1 overflow-hidden mt-2">
            {/* Links do menu, cada um com um ícone e label */}
            <SidebarLink
              href="/dashboard"
              label="Agendamentos"
              pathname={pathname}
              isCollapsed={isCollapsed}
              icon={<CalendarCheck2 className="w-6 h-6" />}
            />
            <SidebarLink
              href="/dashboard/services"
              label="Serviços"
              pathname={pathname}
              isCollapsed={isCollapsed}
              icon={<Folder className="w-6 h-6" />}
            />
            <SidebarLink
              href="/dashboard/profile"
              label="Meu perfil"
              pathname={pathname}
              isCollapsed={isCollapsed}
              icon={<Settings className="w-6 h-6" />}
            />
            <SidebarLink
              href="/dashboard/plans"
              label="Planos"
              pathname={pathname}
              isCollapsed={isCollapsed}
              icon={<Banknote className="w-6 h-6" />}
            />
            <SidebarLogoutButton isCollapsed={isCollapsed} />
          </nav>
        )}
        {/* Componente que permite expandir ou colapsar seu conteúdo // Ele só aparece expandido quando a sidebar NÃO está colapsada (isCollapsed =  false)*/}
        <Collapsible open={!isCollapsed}>
          {/* Conteúdo visível somente quando o Collapsible estiver aberto */}
          <CollapsibleContent>
            {/* Menu de navegação exibido em forma de coluna com espaçamento entre os itens */}
            <nav className="flex flex-col gap-1 overflow-hidden">
              {/* Título da seção do menu */}
              <span className="text-sm text-gray-400 font-medium mt-1 uppercase">
                Painel
              </span>

              {/* Link para a página de agendamentos */}
              <SidebarLink
                href="/dashboard"
                label="Agendamentos"
                pathname={pathname}
                isCollapsed={isCollapsed}
                icon={<CalendarCheck2 className="w-6 h-6" />}
              />

              {/* Link para a página de serviços */}
              <SidebarLink
                href="/dashboard/services"
                label="Serviços"
                pathname={pathname}
                isCollapsed={isCollapsed}
                icon={<Folder className="w-6 h-6" />}
              />

              {/* Título da próxima seção do menu */}
              <span className="text-sm text-gray-400 font-medium mt-1 uppercase">
                Configurações
              </span>

              {/* Link para o perfil do usuário */}
              <SidebarLink
                href="/dashboard/profile"
                label="Meu perfil"
                pathname={pathname}
                isCollapsed={isCollapsed}
                icon={<Settings className="w-6 h-6" />}
              />

              {/* Link para a página de planos */}
              <SidebarLink
                href="/dashboard/plans"
                label="Planos"
                pathname={pathname}
                isCollapsed={isCollapsed}
                icon={<Banknote className="w-6 h-6" />}
              />
              <SidebarLogoutButton isCollapsed={isCollapsed} />
            </nav>
          </CollapsibleContent>
        </Collapsible>
      </aside>
      {/*Container principal da parte direita da tela (área de conteúdo)*/}
      <div
        className={clsx("flex flex-1 flex-col transition-all duration-300", {
          // Se a sidebar estiver colapsada, aplica margem à esquerda menor (20px em telas médias)
          "md:ml-20": isCollapsed,
          // Se a sidebar estiver expandida, aplica margem à esquerda maior (64px em telas médias)
          "md:ml-64": !isCollapsed,
        })}
      >
        {/* Cabeçalho visível apenas em dispositivos móveis (md:hidden) */}
        <header className="md:hidden flex items-center justify-between border-b px-2 md:px-6 h-14 z-10 sticky top-0 bg-white">
          {/* Componente Sheet (menu lateral tipo "drawer") */}
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            {/* Container com ícone de menu e título */}
            <div className="flex items-center gap-4">
              {/* Botão que ativa o menu lateral no mobile */}
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="md:hidden cursor-pointer"
                  // Quando o botão é clicado, garante que o menu lateral não esteja colapsado
                  onClick={() => setIsCollapsed(false)}
                >
                  <List className="w-5 h-5" /> {/* Ícone de "hambúrguer" */}
                </Button>
              </SheetTrigger>

              {/* Título visível no topo do menu */}
              <h1 className="text-base md:text-lg font-semibold">
                Menu Odonto<span className="text-emerald-500">PRO</span>
              </h1>
            </div>

            {/* Conteúdo do menu lateral (drawer) que aparece vindo da direita */}
            <SheetContent side="right" className="sm:max-w-xs text-black">
              {/* Cabeçalho dentro do menu com nome e descrição */}
              <div className="flex flex-col gap-1 p-2.5">
                <SheetTitle>
                  <p className="text-base md:text-lg font-semibold">
                    Odonto<span className="text-emerald-500">PRO</span>
                  </p>
                </SheetTitle>
                <SheetDescription>Menu Administrativo</SheetDescription>
              </div>

              {/* Navegação dentro do menu lateral */}
              <nav className="grid gap-2 text-base pt-5">
                {/* Links do menu, cada um representando uma página com ícone */}
                <SidebarLink
                  href="/dashboard"
                  label="Agendamentos"
                  pathname={pathname}
                  isCollapsed={isCollapsed}
                  closeMenu={closeMenu} // Fecha o menu quando clicado
                  icon={<CalendarCheck2 className="w-6 h-6" />}
                />

                <SidebarLink
                  href="/dashboard/services"
                  label="Serviços"
                  pathname={pathname}
                  isCollapsed={isCollapsed}
                  closeMenu={closeMenu}
                  icon={<Folder className="w-6 h-6" />}
                />

                <SidebarLink
                  href="/dashboard/profile"
                  label="Meu perfil"
                  pathname={pathname}
                  isCollapsed={isCollapsed}
                  closeMenu={closeMenu}
                  icon={<Settings className="w-6 h-6" />}
                />

                <SidebarLink
                  href="/dashboard/plans"
                  label="Planos"
                  pathname={pathname}
                  isCollapsed={isCollapsed}
                  closeMenu={closeMenu}
                  icon={<Banknote className="w-6 h-6" />}
                />

                {/* 🔴 Botão de logout adicionado aqui */}
                <SidebarLogoutButton isCollapsed={false} />
              </nav>
            </SheetContent>
          </Sheet>
        </header>

        {/* Área principal onde o conteúdo das páginas será renderizado */}
        <main className="flex-1 py-4 px-2 md:p-6">
          {children} {/* Este children representa o conteúdo da página atual */}
        </main>
      </div>
    </div>
  );
}

// Define o formato (tipagem) das props que o componente SidebarLink vai receber
interface SidebarLinkProps {
  href: string; // Caminho (rota) para onde o link deve levar
  icon: React.ReactNode; // Ícone que será exibido no link
  label: string; // Texto do link
  pathname: string; // Caminho atual da URL, usado para verificar se este link está ativo
  isCollapsed: boolean; // Indica se a sidebar está colapsada (fechada)
  closeMenu?: () => void; // Função opcional para fechar o menu (usada em dispositivos móveis)
}

// Componente funcional SidebarLink que renderiza um item da sidebar
function SidebarLink({
  href, // Rota do link
  icon, // Ícone do link
  isCollapsed, // Estado da sidebar (colapsada ou não)
  label, // Nome/texto do link
  pathname, // Caminho atual da URL
  closeMenu, // Função para fechar o menu (caso fornecida)
}: SidebarLinkProps) {
  return (
    // Link do Next.js para navegação entre páginas
    <Link href={href} onClick={closeMenu}>
      {/* Div que estiliza o link visualmente */}
      <div
        className={clsx(
          "flex items-center gap-2 px-3 py-2 rounded-md transition-colors", // Estilos base
          {
            // Se o caminho atual for igual ao href, aplica estilos de link ativo
            "text-white bg-blue-500": pathname === href,
            // Caso contrário, estilo de link inativo com hover
            "text-gray-700 hover:bg-gray-100": pathname !== href,
          }
        )}
      >
        {/* Ícone do link com tamanho fixo */}
        <span className="w-6 h-6">{icon}</span>

        {/* Só exibe o texto do link se a sidebar NÃO estiver colapsada */}
        {!isCollapsed && <span>{label}</span>}
      </div>
    </Link>
  );
}
