// Importa a função para obter a sessão atual do usuário
import getSesion from "@/lib/getSession";

// Importa a função de redirecionamento da navegação do Next.js
import { redirect } from "next/navigation";

// Importa o componente que exibe os serviços
import { ServicesContent } from "./_components/service-content";
import { Suspense } from "react";

// Componente assíncrono que representa a página de serviços
export default async function Services() {
  // Recupera a sessão do usuário logado
  const session = await getSesion();

  // Se não houver sessão (usuário não logado), redireciona para a home
  if (!session) {
    redirect("/");
  }

  // Se o usuário estiver autenticado, renderiza o componente ServicesContent
  // passando o ID do usuário como prop
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <ServicesContent userId={session.user?.id!} />
    </Suspense>
  );
}
