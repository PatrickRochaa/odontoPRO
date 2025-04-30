// Importa a função que busca todos os serviços do usuário
import { getAllServices } from "../_data-access/get-all-services";
import { canPermission } from '@/utils/permissions/canPermission'

// Importa o componente responsável por exibir a lista de serviços
import { ServicesList } from "./services-list";
import { LabelSubscription } from "@/components/ui/label-subscription";

// Define os tipos esperados para as props do componente
interface ServicesContentProps {
  userId: string; // ID do usuário utilizado para buscar os serviços
}

// Componente assíncrono que renderiza a lista de serviços
export async function ServicesContent({ userId }: ServicesContentProps) {
  // Busca todos os serviços do usuário com base no userId recebido
  const services = await getAllServices({ userId: userId });
  const permissions = await canPermission({ type: "service" })

  //console.log(services) // (Comentado) Log para depuração - útil para ver a resposta recebida

  // Renderiza o componente ServicesList passando os dados retornados
  // Se não houver dados, passa um array vazio para evitar erros
  return (
    <>
      {!permissions.hasPermission && (
        <LabelSubscription expired={permissions.expired} />
      )}
      <ServicesList services={services.data || []} permission={permissions} />
    </>
  );
}
