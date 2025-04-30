"use client"; // Indica que este componente será executado no cliente (não no servidor)

import { useRouter } from "next/navigation"; // Hook para redirecionar o usuário após logout
import { signOut } from "next-auth/react"; // Função para deslogar o usuário
import { LogOut } from "lucide-react"; // Ícone de logout
import React from "react";

// Tipagem das props que o componente espera receber
interface Props {
  isCollapsed: boolean; // Define se o menu está colapsado (escondendo os textos)
}

export function SidebarLogoutButton({ isCollapsed }: Props) {
  const router = useRouter(); // Inicializa o hook para navegar entre páginas

  // Função responsável por fazer logout e redirecionar o usuário para a home
  const handleLogout = async () => {
    await signOut(); // Realiza o logout com NextAuth
    router.replace("/"); // Redireciona o usuário para a página inicial (home)
  };

  return (
    <button
      onClick={handleLogout} // Chama o handleLogout ao clicar no botão
      className={`
        flex items-center gap-2 
        ${isCollapsed ? "px-3 justify-center" : "px-4 justify-start"} 
        py-2 text-sm bg-red-600 text-white rounded-md 
        transition hover:bg-red-700 cursor-pointer font-medium w-full
      `}
    >
      {/* Ícone de logout (sempre visível) */}
      <LogOut className="w-6 h-6" />

      {/* Texto 'Sair' só aparece se o menu não estiver colapsado */}
      {!isCollapsed && <span>Sair</span>}
    </button>
  );
}
