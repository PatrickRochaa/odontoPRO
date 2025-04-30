// Importa a função personalizada para obter a sessão do usuário logado
import getSesion from "@/lib/getSession";

// Importa a função de redirecionamento do Next.js (usada em rotas server components)
import { redirect } from "next/navigation";

// Importa a função que busca os dados do usuário no banco de dados
import { getUserData } from "./_data-access/get-info-user";

// Importa o componente que será exibido com os dados do perfil do usuário
import { ProfileContent } from "./_components/profile";
import { Suspense } from "react";

// Função assíncrona padrão do componente da página de perfil (server component)
export default async function Profile() {
  // Obtém a sessão do usuário atual
  const session = await getSesion();

  // Se não houver sessão (usuário não logado), redireciona para a home
  if (!session) {
    redirect("/");
  }

  // Busca os dados do usuário no banco de dados, passando o ID do usuário da sessão
  const user = await getUserData({ userId: session.user?.id });

  // Se os dados do usuário não forem encontrados, também redireciona para a home
  if (!user) {
    redirect("/");
  }

  // Renderiza o componente de conteúdo do perfil, passando os dados do usuário como props
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <ProfileContent user={user} />
    </Suspense>
  );
}
