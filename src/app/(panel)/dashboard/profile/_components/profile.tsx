// Define que o componente é client-side (necessário para usar hooks do React)
"use client";

// Importa o hook useState do React
import { useState } from "react";

// Importa o hook de formulário e o tipo dos dados
import { ProfileFormData, useProfileForm } from "./profile-form";

// Importa os componentes de UI para o card
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Importa os componentes relacionados ao formulário
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

// Importa o input
import { Input } from "@/components/ui/input";

// Importa os componentes de select (dropdown)
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Importa o componente de label
import { Label } from "@/components/ui/label";

// Importa o componente de imagem do Next.js
import Image from "next/image";

// Importa os componentes de modal (dialog)
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// Importa o botão
import { Button } from "@/components/ui/button";

// Ícone para setinha → usado em botões ou navegação
import { ArrowRight } from "lucide-react";

// Importa uma imagem local (foto de exemplo)
import imgTest from "../../../../../../public/foto1.png";

// Importa função utilitária para classnames condicionais
import { cn } from "@/lib/utils";

// Importa o tipo do Prisma que inclui relação com subscription
import { Prisma } from "@prisma/client";

// Importa a função que atualiza o perfil do usuário
import { updateProfile } from "../_actions/update-profile";

// Importa biblioteca de notificações
import { toast } from "sonner";

// Função utilitária para formatar número de telefone
import { formatPhone } from "@/utils/formatPhone";

// Importa funções de autenticação do NextAuth
import { signOut, useSession } from "next-auth/react";

// Importa hook para navegação no Next.js
import { useRouter } from "next/navigation";
import { AvatarProfile } from "./profile-avatar";

// Define um tipo de usuário que inclui os dados de subscription (assinatura)
type UserWithSubscription = Prisma.UserGetPayload<{
  include: {
    subscription: true;
  };
}>;

// Define as props esperadas pelo componente ProfileContent
interface ProfileContentProps {
  user: UserWithSubscription;
}
// Componente que exibe e permite editar o perfil do usuário
export function ProfileContent({ user }: ProfileContentProps) {
  // Estado para armazenar os horários selecionados pelo usuário
  const [selectedHours, setSelectedHours] = useState<string[]>(
    user.times ?? [] // Usa os horários já salvos no banco ou array vazio
  );

  // Estado para controlar a abertura/fechamento do modal de seleção de horários
  const [dialogIsOpen, setDialogIsOpen] = useState(false);

  // Hook do NextAuth para atualizar a sessão após alterações no perfil
  const { update } = useSession();

  // Hook de navegação para redirecionar o usuário
  const router = useRouter();

  // Inicializa o formulário com os dados do usuário vindos do banco
  const form = useProfileForm({
    name: user.name,
    address: user.address,
    phone: user.phone,
    status: user.status,
    timeZone: user.timeZone,
  });

  // Função que gera os horários de 30 em 30 minutos, das 08:00 às 24:00
  function generateTimeSlots(): string[] {
    const hours: string[] = []; // Array para armazenar os horários gerados

    // Laço que percorre de 08 até 24 horas
    for (let i = 8; i <= 24; i++) {
      // Dentro de cada hora, gera dois horários: XX:00 e XX:30
      for (let j = 0; j < 2; j++) {
        const hour = i.toString().padStart(2, "0"); // Garante que o número da hora tenha dois dígitos (ex: "08")
        const minute = (j * 30).toString().padStart(2, "0"); // Gera "00" ou "30" para os minutos

        // Adiciona o horário formatado ao array
        hours.push(`${hour}:${minute}`);
      }
    }

    return hours; // Retorna todos os horários possíveis
  }

  // Armazena todos os horários gerados
  const hours = generateTimeSlots();

  // Função para alternar seleção de um horário
  function toggleHour(hour: string) {
    setSelectedHours(
      (prev) =>
        prev.includes(hour)
          ? prev.filter((h) => h !== hour) // Se já estiver selecionado, remove
          : [...prev, hour].sort() // Se não estiver, adiciona e ordena
    );
  }
  /* Função para salvar horários e exibir um toast de sucesso */
  function handleSaveHours() {
    setDialogIsOpen(false); // Fecha o modal de seleção de horários
    // Aqui você pode futuramente salvar os horários no backend ou em localStorage, se desejar
    toast.success("Horários salvos com sucesso!"); // Exibe uma mensagem de sucesso para o usuário
  }

  // Lista de fusos horários suportados, filtrando apenas os principais do Brasil
  const timeZones = Intl.supportedValuesOf("timeZone").filter(
    (zone) =>
      zone.startsWith("America/Sao_Paulo") || // Horário de Brasília
      zone.startsWith("America/Fortaleza") || // Nordeste
      zone.startsWith("America/Recife") || // Pernambuco
      zone.startsWith("America/Bahia") || // Bahia
      zone.startsWith("America/Belem") || // Pará
      zone.startsWith("America/Manaus") || // Amazonas
      zone.startsWith("America/Cuiaba") || // Mato Grosso
      zone.startsWith("America/Boa_Vista") // Roraima
  );

  // Função executada ao enviar o formulário de perfil
  async function onSubmit(values: ProfileFormData) {
    // Chama a função que atualiza o perfil no banco de dados com os dados do formulário
    const response = await updateProfile({
      name: values.name,
      address: values.address,
      status: values.status === "active" ? true : false, // Converte string "active"/"inactive" para booleano
      phone: values.phone,
      timeZone: values.timeZone,
      times: selectedHours || [], // Envia os horários selecionados
    });

    // Se houve erro na resposta, exibe mensagem de erro
    if (response.error) {
      toast.error(response.error);
      return;
    }

    // Se tudo deu certo, exibe mensagem de sucesso com o retorno do backend
    toast.success(response.data);
  }

  // Função para realizar logout do sistema
  async function handleLogout() {
    await signOut(); // Faz logout com NextAuth
    await update(); // Atualiza a sessão para remover os dados do usuário logado
    router.replace("/"); // Redireciona o usuário para a página inicial
  }

  return (
    <div className="mx-auto">
      {" "}
      {/* Container principal centralizado horizontalmente */}
      {/* Componente do formulário com o hook form */}
      <Form {...form}>
        {/* Formulário com envio controlado pelo hook form */}
        <form onSubmit={form.handleSubmit(onSubmit)}>
          {/* Card que contém todo o conteúdo do perfil */}
          <Card>
            {/* Cabeçalho do Card */}
            <CardHeader>
              <CardTitle>Meu Perfil</CardTitle> {/* Título do formulário */}
            </CardHeader>

            {/* Conteúdo do Card com espaçamento entre os elementos */}
            <CardContent className="space-y-6">
              {/* Imagem do usuário */}
              <div className="flex justify-center">
                <AvatarProfile avatarUrl={user.image} userId={user.id} />
              </div>

              <div className="space-y-4">
                {" "}
                {/* Espaçamento vertical entre campos */}
                {/* Campo de nome completo */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold">
                        Nome completo
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Digite o nome da clinica..."
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Campo de endereço */}
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold">
                        Endereço completo:
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Digite o endereço da clinica..."
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Campo de telefone da clínica com formatação automática */}
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold">Telefone</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="(67) 99912-3456"
                          onChange={(e) => {
                            const formattedValue = formatPhone(e.target.value); // Formata o telefone
                            field.onChange(formattedValue); // Atualiza o valor no form
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Campo de status da clínica (ativo/inativo) */}
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold">
                        Status da clinica
                      </FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value ? "active" : "inactive"} // Define valor padrão com base no estado atual
                        >
                          <SelectTrigger className="w-full cursor-pointer">
                            <SelectValue placeholder="Selecione o status da clincia" />
                          </SelectTrigger>
                          <SelectContent>
                            {/* Opção para clínica ativa */}
                            <SelectItem
                              value="active"
                              className="cursor-pointer"
                            >
                              ATIVO (clinica aberta)
                            </SelectItem>

                            {/* Opção para clínica inativa */}
                            <SelectItem
                              value="inactive"
                              className="cursor-pointer"
                            >
                              INATIVO (clinica fechada)
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                    </FormItem>
                  )}
                />
                {/* Modal para selecionar horários de funcionamento da clínica */}
                <div className="space-y-2">
                  <Label className="font-semibold">
                    Configurar horários da clinica
                  </Label>

                  {/* Componente Dialog (modal) para seleção de horários */}
                  <Dialog open={dialogIsOpen} onOpenChange={setDialogIsOpen}>
                    <DialogTrigger asChild>
                      {/* Botão que abre o modal */}
                      <Button
                        variant="outline"
                        className="w-full justify-between cursor-pointer"
                      >
                        Clique aqui para selecionar horários
                        <ArrowRight className="w-5 h-5" />
                      </Button>
                    </DialogTrigger>

                    {/* Conteúdo interno do modal */}
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Horários da clinica</DialogTitle>
                        <DialogDescription>
                          Selecione abaixo os horários de funcionamento da
                          clinica:
                        </DialogDescription>
                      </DialogHeader>

                      {/* Container dos botões de horários */}
                      <section className="py-4">
                        <p className="text-sm text-muted-foreground mb-2">
                          clique para marcar ou desmarcar horarios
                        </p>

                        {/* Grid com os horários disponíveis */}
                        <div className="grid grid-cols-5 gap-2">
                          {hours.map((hour) => (
                            <Button
                              key={hour}
                              variant="outline"
                              className={cn(
                                "h-10 cursor-pointer",
                                selectedHours.includes(hour) &&
                                "border-2 border-emerald-500 text-primary" // Destaque se o horário estiver selecionado
                              )}
                              onClick={() => toggleHour(hour)} // Alterna a seleção do horário
                            >
                              {hour}
                            </Button>
                          ))}
                        </div>
                      </section>

                      {/* Botão para salvar os horários selecionados */}
                      <Button
                        className="w-fullcursor-pointer"
                        onClick={() => handleSaveHours()}
                      >
                        Salvar Horário
                      </Button>
                    </DialogContent>
                  </Dialog>
                </div>
                {/* Campo de seleção de fuso horário */}
                <FormField
                  control={form.control}
                  name="timeZone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold">
                        Selecione o fuso horário
                      </FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value} // Valor atual do fuso horário
                        >
                          <SelectTrigger className="w-full cursor-pointer">
                            <SelectValue placeholder="Selecione o seu fuso horário" />
                          </SelectTrigger>
                          <SelectContent>
                            {/* Opções de fusos horários disponíveis */}
                            {timeZones.map((zone) => (
                              <SelectItem
                                key={zone}
                                value={zone}
                                className="cursor-pointer"
                              >
                                {zone}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                    </FormItem>
                  )}
                />
                {/* Botão principal do formulário para salvar todas as alterações */}
                <Button type="submit" className="w-full cursor-pointer">
                  Salvar alterações
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </Form>
      {/* Seção de logout */}
      <section>
        <Button
          variant="destructive"
          onClick={handleLogout} // Chama função de logout
          className="mt-2 cursor-pointer"
        >
          Sair da conta
        </Button>
      </section>
    </div>
  );
}
