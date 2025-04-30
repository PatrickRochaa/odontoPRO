// Indica que esse componente será renderizado no cliente (necessário para usar APIs como `navigator.clipboard`)
"use client"

// Importa o componente de botão personalizado
import { Button } from "@/components/ui/button"

// Importa o ícone de link da biblioteca lucide-react
import { LinkIcon } from "lucide-react"

// Importa o toast para exibir mensagens de sucesso ou erro
import { toast } from 'sonner'

// Componente responsável por exibir um botão que copia o link de agendamento
export function ButtonCopyLink({ userId }: { userId: string }) {

  // Função acionada ao clicar no botão
  async function handleCopyLink() {
    // Copia para a área de transferência o link com o ID do usuário (link da clínica)
    await navigator.clipboard.writeText(`${process.env.NEXT_PUBLIC_URL}/clinica/${userId}`)

    // Exibe uma mensagem de sucesso usando o toast
    toast.success("Link de agendamento copiado com sucesso!")
  }

  return (
    // Botão que ao ser clicado chama a função de copiar o link
    <Button onClick={handleCopyLink}>
      {/* Ícone de link dentro do botão */}
      <LinkIcon className="w-5 h-5" />
    </Button>
  )
}
