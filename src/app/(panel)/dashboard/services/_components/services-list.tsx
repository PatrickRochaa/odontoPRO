// Habilita o componente como client-side
"use client";

// Importa o hook useState do React para gerenciar estados locais
import { useState } from "react";

// Importa os componentes de diálogo para exibir o formulário de cadastro/edição de serviços
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// Importa os componentes de cartão (card) para a interface dos serviços
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Importa o botão reutilizável
import { Button } from "@/components/ui/button";

// Importa ícones da biblioteca Lucide
import { Pencil, Plus, X } from "lucide-react";

// Importa o componente de formulário de serviço
import { DialogService } from "./dialog-service";

// Importa o tipo Service do Prisma
import { Service } from "@prisma/client";

// Importa função utilitária para formatar valor em moeda
import { formatCurrency } from "@/utils/formatCurrency";

// Importa função para deletar serviço
import { deleteService } from "../_actions/delete-service";

// Importa o sistema de notificações
import { toast } from "sonner";
import { ResultPermissionProp } from "@/utils/permissions/canPermission";
import Link from "next/link";

// Define as props esperadas pelo componente
interface ServicesListProps {
  services: Service[]; // Lista de serviços vinda do backend
  permission: ResultPermissionProp;
}

// Componente responsável por exibir a lista de serviços
export function ServicesList({ services, permission }: ServicesListProps) {
  // Estado para controlar se o modal de diálogo está aberto
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Estado que armazena o serviço em edição (se houver)
  const [editingService, setEditingService] = useState<null | Service>(null);

  const serviceList = permission.hasPermission ? services : services.slice(0, 10)

  // Função assíncrona para deletar um serviço pelo ID
  async function handleDeleteService(serviceId: string) {
    // Chama a função para deletar o serviço
    const response = await deleteService({ serviceId: serviceId });

    // Verifica se houve erro na resposta e exibe toast de erro
    if (response.error) {
      toast.error(response.error);
      return;
    }

    // Exibe toast de sucesso se o serviço foi deletado com sucesso
    toast.success(response.data);
  }

  // Função que prepara os dados do serviço para edição
  function handleEditService(service: Service) {
    // Define o serviço que será editado
    setEditingService(service);

    // Abre o modal de diálogo
    setIsDialogOpen(true);
  }

  return (
    // Componente Dialog engloba todo o modal
    <Dialog open={isDialogOpen}
      onOpenChange={(open) => {
        setIsDialogOpen(open)

        if (!open) {
          setEditingService(null)
        }
      }}>
      <section className="mx-auto">
        {/* Cartão principal que contém o título, botão de adicionar e lista de serviços */}
        <Card>
          {/* Cabeçalho do cartão */}
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            {/* Título do cartão */}
            <CardTitle className="text-xl md:text-2xl font-bold">
              Serviços
            </CardTitle>

            {/* Botão para abrir o modal de novo serviço */}
            {permission.hasPermission && (
              <DialogTrigger asChild className=" cursor-pointer">
                <Button>
                  <Plus className="w-4 h-4" />
                </Button>
              </DialogTrigger>
            )}

            {!permission.hasPermission && (
              <Link href="/dashboard/plans" className="text-red-500">
                Limite de serviços atingido.
              </Link>
            )}
            {/* Conteúdo do diálogo/modal */}
            <DialogContent
              // Fecha o modal e reseta o serviço em edição ao clicar fora
              onInteractOutside={(e) => {
                e.preventDefault();
                setIsDialogOpen(false);
                setEditingService(null);
              }}
            >
              {/* Formulário de serviço (reutilizado para criar ou editar) */}
              <DialogService
                // Função para fechar o modal manualmente
                closeModal={() => {
                  setIsDialogOpen(false);
                  setEditingService(null);
                }}
                // ID do serviço em edição (caso exista)
                serviceId={editingService ? editingService.id : undefined}
                // Valores iniciais do formulário, preenchidos em caso de edição
                initialValues={
                  editingService
                    ? {
                      name: editingService.name,
                      price: (editingService.price / 100)
                        .toFixed(2)
                        .replace(".", "."), // Formata o valor para string
                      hours: Math.floor(
                        editingService.duration / 60
                      ).toString(), // Converte duração em horas
                      minutes: (editingService.duration % 60).toString(), // Converte duração em minutos
                    }
                    : undefined // Se não estiver editando, valores ficam indefinidos
                }
              />
            </DialogContent>
          </CardHeader>

          {/* Conteúdo do cartão, onde os serviços são listados */}
          <CardContent>
            <section className="space-y-4 mt-5">
              {/* Mapeia os serviços recebidos e renderiza um bloco para cada um */}
              {serviceList.map((service) => (
                <article
                  key={service.id}
                  className="flex items-center justify-between"
                >
                  {/* Container com o nome e o valor do serviço */}
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold">{service.name}</span>
                    <span className="text-gray-500">-</span>
                    <span>{formatCurrency(service.price / 100)}</span>
                  </div>

                  {/* Container com os botões de ação (editar/deletar) */}
                  <div>
                    {/* Botão para editar serviço */}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        handleEditService(service);
                      }}
                    >
                      <Pencil className="w-4 h-4 cursor-pointer" />
                    </Button>

                    {/* Botão para apagar serviço */}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        handleDeleteService(service.id);
                      }}
                    >
                      <X className="w-4 h-4 cursor-pointer" />
                    </Button>
                  </div>
                </article>
              ))}
            </section>
          </CardContent>
        </Card>
      </section>
    </Dialog>
  );
}
