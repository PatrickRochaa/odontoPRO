// Declara que o componente será utilizado no client-side do Next.js
"use client"

// Importação de componentes reutilizáveis da interface (botão, formulário, textarea, etc.)
import { Button } from "@/components/ui/button"
import { useReminderForm, ReminderFormdata } from "./reminder-form"
import {
  Form,
  FormItem,
  FormField,
  FormLabel,
  FormControl,
  FormMessage
} from "@/components/ui/form"
import { Textarea } from '@/components/ui/textarea'

// Função que realiza o envio dos dados do lembrete para o backend
import { createReminder } from '../../_actions/create-reminder'

// Biblioteca para exibir notificações
import { toast } from "sonner"

// Hook do Next.js para redirecionamento e atualização de rota
import { useRouter } from 'next/navigation'

// Tipagem das props esperadas pelo componente
interface ReminderContentProps {
  closeDialog: () => void; // Função para fechar o modal após o envio
}

// Componente principal que renderiza o conteúdo do formulário de lembrete
export function ReminderContent({ closeDialog }: ReminderContentProps) {
  // Hook personalizado que retorna os métodos do formulário (validação, controle, etc.)
  const form = useReminderForm()

  // Hook de roteamento do Next.js
  const router = useRouter();

  // Função executada ao enviar o formulário
  async function onSubmit(formData: ReminderFormdata) {
    // Envia os dados do formulário para criar um novo lembrete
    const response = await createReminder({ description: formData.description })

    // Se ocorrer um erro, exibe uma notificação de erro
    if (response.error) {
      toast.error(response.error)
      return;
    }

    // Exibe uma notificação de sucesso
    toast.success(response.data)

    // Atualiza a página para refletir o novo lembrete
    router.refresh();

    // Fecha o modal
    closeDialog();
  }

  return (
    <div className="grid gap-4 py-4">
      {/* Componente de formulário com integração à biblioteca de form */}
      <Form {...form}>
        <form
          className="flex flex-col gap-4"
          onSubmit={form.handleSubmit(onSubmit)} // Define a função ao submeter o formulário
        >
          {/* Campo do formulário para a descrição do lembrete */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold">Descreva o lembrete:</FormLabel>
                <FormControl>
                  <Textarea
                    {...field} // Conecta o campo ao controle do formulário
                    placeholder="Digite o nome do lembrete..."
                    className="max-h-52"
                  />
                </FormControl>
                <FormMessage /> {/* Exibe mensagens de erro de validação */}
              </FormItem>
            )}
          />

          {/* Botão para enviar o formulário */}
          <Button
            className="cursor-pointer"
            type="submit"
            disabled={!form.watch("description")} // Desativa o botão se o campo estiver vazio
          >
            Cadastrar lembrete
          </Button>
        </form>
      </Form>
    </div>
  )
}
