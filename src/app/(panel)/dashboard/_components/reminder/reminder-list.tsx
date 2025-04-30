// Define que este componente será renderizado no cliente (client-side)
"use client"

// Importa o hook useState do React para gerenciar o estado local
import { useState } from "react"

// Importa o componente de botão personalizado
import { Button } from "@/components/ui/button"

// Importa componentes do Card (cartão visual) para organizar a interface
import { Card, CardContent, CardTitle, CardHeader } from "@/components/ui/card"

// Importa o tipo Reminder (lembrete) do Prisma
import { Reminder } from "@prisma/client"

// Importa os ícones Plus (adicionar) e Trash (lixeira) da biblioteca lucide-react
import { Plus, Trash } from "lucide-react"

// Importa o componente de área rolável (scroll)
import { ScrollArea } from '@/components/ui/scroll-area'

// Importa a função que realiza a exclusão de lembretes
import { deleteReminder } from '../../_actions/delete-reminder'

// Importa a função toast para exibir notificações
import { toast } from 'sonner'

// Importa o hook useRouter do Next.js para navegar ou atualizar a página
import { useRouter } from "next/navigation"

// Importa os componentes relacionados ao modal de diálogo (popup)
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription
} from '@/components/ui/dialog'

// Importa o conteúdo do formulário de novo lembrete
import { ReminderContent } from './reminder-content'


// Define a tipagem para as propriedades recebidas pelo componente ReminderList
interface ReminderListProps {
  reminder: Reminder[] // Um array de objetos do tipo Reminder
}

// Função principal que renderiza a lista de lembretes
export function ReminderList({ reminder }: ReminderListProps) {

  // Inicializa o roteador do Next.js
  const router = useRouter();

  // Estado para controlar se o modal (diálogo) está aberto ou não
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // Função assíncrona para deletar um lembrete
  async function handleDeleteReminder(id: string) {
    // Executa a função que deleta o lembrete no backend
    const response = await deleteReminder({ reminderId: id })

    // Caso ocorra um erro, exibe notificação de erro
    if (response.error) {
      toast.error(response.error)
      return;
    }

    // Caso o lembrete seja deletado com sucesso, exibe mensagem de sucesso
    toast.success(response.data);

    // Atualiza os dados da página (faz um refresh)
    router.refresh();
  }

  // Retorna a estrutura visual do componente
  return (
    <div className="flex flex-col gap-3">
      <Card>
        {/* Cabeçalho do card contendo o título e botão de novo lembrete */}
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xl md:text-2xl font-bold">
            Lembretes
          </CardTitle>

          {/* Modal para criar novo lembrete */}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            {/* Botão que abre o modal */}
            <DialogTrigger asChild>
              <Button variant="ghost" className="w-9 p-0 cursor-pointer">
                <Plus className="w-5 h-5" />
              </Button>
            </DialogTrigger>

            {/* Conteúdo do modal */}
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Novo Lembrete</DialogTitle>
                <DialogDescription>
                  Criar um novo lembrete para sua lista.
                </DialogDescription>
              </DialogHeader>

              {/* Formulário para adicionar novo lembrete */}
              <ReminderContent closeDialog={() => setIsDialogOpen(false)} />
            </DialogContent>
          </Dialog>
        </CardHeader>

        {/* Corpo do card onde os lembretes são listados */}
        <CardContent>
          {/* Se não houver lembretes, exibe uma mensagem */}
          {reminder.length === 0 && (
            <p className="text-sm text-gray-500">
              Nenhum lembrete registrado...
            </p>
          )}

          {/* Área rolável que contém a lista de lembretes */}
          <ScrollArea className="h-[340px] lg:max-h-[calc(100vh-15rem)] pr-0 w-full flex-1">
            {/* Percorre cada lembrete e renderiza na tela */}
            {reminder.map((item) => (
              <article
                key={item.id} // Define a chave única do elemento
                className="flex flex-wrap flex-row items-center justify-between py-2 bg-yellow-100 mb-2 px-2 rounded-md"
              >
                {/* Descrição do lembrete */}
                <p className="text-sm lg:text-base">{item.description}</p>

                {/* Botão de deletar lembrete */}
                <Button
                  className="bg-red-500 hover:bg-red-400 shadow-none rounded-full p-2 cursor-pointer"
                  size="sm"
                  onClick={() => handleDeleteReminder(item.id)}
                >
                  <Trash className="w-4 h-4 text-white" />
                </Button>
              </article>
            ))}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}
