// Importa a função `redirect` do Next.js para redirecionar o usuário, se necessário
import { redirect } from "next/navigation";

// Importa a função que busca informações do agendamento de uma clínica/usuário
import { getInfoSchedule } from "./_data-access/get-info-schedule";

// Importa o componente que renderiza o conteúdo da página de agendamento
import { ScheduleContent } from "./_components/schedule-content";

// Função principal que define a página de agendamento.
// Ela é assíncrona porque depende de chamadas assíncronas (busca de dados)
export default async function SchedulePage({
  params, // Recebe os parâmetros da URL — neste caso, o `id` da clínica/usuário
}: {
  params: Promise<{ id: string }>; // Tipagem de `params`, que é uma Promise com o `id`
}) {
  // Espera a resolução da Promise e extrai o ID do usuário da URL
  const userId = (await params).id;

  // Chama a função que busca as informações do agendamento com base no `userId`
  const user = await getInfoSchedule({ userId: userId });

  // Se não encontrar o usuário (retorno for `null` ou `undefined`), redireciona para a página inicial
  if (!user) {
    redirect("/"); // Função nativa do Next.js App Router
  }

  // Se encontrou o usuário, renderiza o componente que exibe os dados de agendamento,
  // passando o objeto `user` (com dados da clínica ou do profissional)
  return (
    <div>
      <ScheduleContent clinic={user} />
    </div>
  );
}
