// Define que esse componente será executado no lado do cliente
"use client";

// Importa o componente de imagem otimizada do Next.js
import Image from "next/image";

// Importa uma imagem local usada na interface
import imgTest from "../../../../../../public/foto1.png";

// Importa o ícone de localização (pin no mapa) da biblioteca Lucide
import { MapPin } from "lucide-react";

// Importa tipos do Prisma para utilizar com os dados da clínica
import { Prisma } from "@prisma/client";

// Importa o tipo do formulário e o hook personalizado para manipulação do formulário
import { AppointmentFormData, useAppointmentForm } from "./schedule-form";

// Importa o componente de botão personalizado
import { Button } from "@/components/ui/button";

// Importa os componentes básicos de formulário personalizados (Label, Input, etc.)
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

// Importa os componentes do sistema de formulários personalizados
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

// Importa os componentes do campo de seleção personalizada (Select)
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Importa o componente de seleção de data e hora
import { DateTimePicker } from "./date-picker";

// Importa a função utilitária para formatar telefone em tempo real
import { formatPhone } from "@/utils/formatPhone";

// Importa hooks do React para gerenciar estados e efeitos colaterais
import { useState, useCallback, useEffect } from "react";

// Importa a lista de horários disponíveis e bloqueados para exibição
import { ScheduleTimeList } from "./schedule-time-list";

// Importa a função para criar um novo agendamento (ação do servidor)
import { createNewAppointment } from "../_actions/create-appointment";

// Importa o sistema de notificações da lib Sonner
import { toast } from "sonner";

// Define um tipo baseado no retorno do Prisma, incluindo serviços e assinatura da clínica
type UserWithServiceAndSubscription = Prisma.UserGetPayload<{
  include: {
    subscription: true; // Inclui informações da assinatura
    services: true; // Inclui serviços cadastrados pela clínica
  };
}>;

// Interface que define os dados esperados pelo componente ScheduleContent
interface ScheduleContentProps {
  clinic: UserWithServiceAndSubscription; // Clínica com serviços e assinatura
}

// Interface que define um slot de horário
export interface TimeSlot {
  time: string; // Horário (ex: "09:00")
  available: boolean; // Se esse horário está disponível ou não
}
// Função que define o componente principal de agendamento, recebendo os dados da clínica como prop
export function ScheduleContent({ clinic }: ScheduleContentProps) {
  // Hook personalizado que retorna métodos e valores do formulário de agendamento
  const form = useAppointmentForm();

  // Extrai a função watch para acompanhar os valores do formulário em tempo real
  const { watch } = form;

  // Observa a data selecionada no formulário
  const selectedDate = watch("date");

  // Observa o serviço selecionado no formulário
  const selectedServiceId = watch("serviceId");

  // Estado que guarda o horário escolhido pelo usuário
  const [selectedTime, setSelectedTime] = useState("");

  // Lista com todos os horários disponíveis e se estão ou não disponíveis
  const [availableTimeSlots, setAvailableTimeSlots] = useState<TimeSlot[]>([]);

  // Estado de carregamento dos horários (útil para mostrar spinner ou desabilitar botões)
  const [loadingSlots, setLoadingSlots] = useState(false);

  // Lista de horários que já estão bloqueados para o dia selecionado
  const [blockedTimes, setBlockedTimes] = useState<string[]>([]);

  // Função que busca os horários bloqueados de um determinado dia para a clínica
  const fetchBlockedTimes = useCallback(
    async (date: Date): Promise<string[]> => {
      setLoadingSlots(true); // Inicia o carregamento

      try {
        // Formata a data para YYYY-MM-DD
        const dateString = date.toISOString().split("T")[0];

        // Faz a requisição para API passando o ID da clínica e a data
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_URL}/api/schedule/get-appointments?userId=${clinic.id}&date=${dateString}`
        );

        // Converte a resposta em JSON (espera-se um array de horários bloqueados)
        const json = await response.json();

        setLoadingSlots(false); // Finaliza o carregamento

        return json; // Retorna o array com horários bloqueados
      } catch (err) {
        console.log(err); // Mostra erro no console em caso de falha
        setLoadingSlots(false); // Garante que o carregamento será encerrado
        return []; // Retorna array vazio em caso de erro
      }
    },
    [clinic.id] // A função será recriada apenas se o ID da clínica mudar
  );

  // useEffect dispara sempre que a data ou outros valores mudam
  useEffect(() => {
    if (selectedDate) {
      // Chama a função para buscar os horários bloqueados da data selecionada
      fetchBlockedTimes(selectedDate).then((blocked) => {
        // Atualiza o estado com os horários bloqueados recebidos
        setBlockedTimes(blocked);

        // Pega os horários cadastrados da clínica
        const times = clinic.times || [];

        // Mapeia todos os horários para saber se estão disponíveis ou não
        const finalSlots = times.map((time) => ({
          time: time,
          available: !blocked.includes(time), // Se estiver bloqueado, não está disponível
        }));

        // Atualiza a lista de horários disponíveis com base nos bloqueios
        setAvailableTimeSlots(finalSlots);

        // Verifica se o horário selecionado ainda está disponível
        const stilltAvailable = finalSlots.find(
          (slot) => slot.time === selectedTime && slot.available
        );

        // Se o horário já tiver sido bloqueado ou não existir, limpa a seleção
        if (!stilltAvailable) {
          setSelectedTime("");
        }
      });
    }
  }, [selectedDate, clinic.times, fetchBlockedTimes, selectedTime]);
  // Função que lida com o envio do formulário para registrar um novo agendamento
  async function handleRegisterAppointmnent(formData: AppointmentFormData) {
    // Verifica se o usuário selecionou um horário antes de continuar
    if (!selectedTime) {
      return; // Se não tiver horário, não prossegue
    }

    // Envia os dados do formulário para a função que cria o agendamento no banco
    const response = await createNewAppointment({
      name: formData.name, // Nome do paciente
      email: formData.email, // Email do paciente
      phone: formData.phone, // Telefone do paciente
      time: selectedTime, // Horário selecionado
      date: formData.date, // Data escolhida
      serviceId: formData.serviceId, // Serviço selecionado
      clinicId: clinic.id, // ID da clínica
    });

    // Se a resposta da API tiver erro, mostra um toast de erro
    if (response.error) {
      toast.error(response.error); // Mensagem de erro amigável para o usuário
      return;
    }

    // Se tudo deu certo, mostra um toast de sucesso
    toast.success("Consulta agendada com sucesso!");

    // Reseta os campos do formulário para o estado inicial
    form.reset();

    // Limpa o horário selecionado (deixa pronto para um novo agendamento)
    setSelectedTime("");
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="h-32 bg-emerald-500"></div>
      {/*Container superior*/}
      <section className="container mx-auto px-4 -mt-16">
        <div className="max-w-2xl mx-auto">
          {/*Container geral*/}
          <article className="flex flex-col items-center">
            {/*Imagem da Clinica*/}
            <div className="relative w-48 h-48 rounded-full overflow-hidden border-4 border-white mb-8">
              <Image
                src={clinic.image ? clinic.image : imgTest}
                alt="foto da clínica"
                className="object-cover"
                fill
              />
            </div>

            {/*Nome da Clinica*/}
            <h1 className="text-2xl font-bold mb-2">{clinic.name}</h1>

            {/*endereço da clínica*/}
            <div className="flex items-center gap-1">
              <MapPin className="w-5 h-5" />
              <span>
                {clinic.address ? clinic.address : "Endereço não informado"}
              </span>
            </div>
          </article>
        </div>
      </section>

      {/*Container do formulario*/}
      <section className="max-w-2xl mx-auto w-full mt-6">
        {/* Formulário de agendamento */}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleRegisterAppointmnent)}
            className="mx-2 space-y-6 bg-white p-6 border rounded-md shadow-sm"
          >
            {/*Campo do Nome*/}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="my-2">
                  <FormLabel className="font-semibold">
                    Nome completo:
                  </FormLabel>
                  <FormControl>
                    <Input
                      id="name"
                      placeholder="Digite seu nome completo..."
                      {...field}
                    />
                  </FormControl>
                  {/*Mensagem de erro*/}
                  <FormMessage />
                </FormItem>
              )}
            />

            {/*Campo email*/}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="my-2">
                  <FormLabel className="font-semibold">Email:</FormLabel>
                  <FormControl>
                    <Input
                      id="email"
                      placeholder="Digite seu email..."
                      {...field}
                    />
                  </FormControl>
                  {/*Mensagem de erro*/}
                  <FormMessage />
                </FormItem>
              )}
            />

            {/*Campo telefone*/}
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem className="my-2">
                  <FormLabel className="font-semibold">Telefone:</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      id="phone"
                      placeholder="(XX) XXXXX-XXXX"
                      onChange={(e) => {
                        const formattedValue = formatPhone(e.target.value);
                        field.onChange(formattedValue);
                      }}
                    />
                  </FormControl>
                  {/*Mensagem de erro*/}
                  <FormMessage />
                </FormItem>
              )}
            />

            {/*Campo data*/}
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex items-center gap-2 space-y-1">
                  <FormLabel className="font-semibold">
                    Data do agendamento:
                  </FormLabel>
                  <FormControl>
                    <DateTimePicker
                      initialDate={new Date()}
                      className="w-full rounded border p-2"
                      onChange={(date) => {
                        if (date) {
                          field.onChange(date);
                          setSelectedTime("");
                        }
                      }}
                    />
                  </FormControl>
                  {/*Mensagem de erro*/}
                  <FormMessage />
                </FormItem>
              )}
            />

            {/*Campo do Serviço*/}
            <FormField
              control={form.control}
              name="serviceId"
              render={({ field }) => (
                <FormItem className="my-2">
                  <FormLabel className="font-semibold">
                    Selecione o serviço
                  </FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        setSelectedTime("");
                      }}
                    >
                      <SelectTrigger className="w-full cursor-pointer">
                        <SelectValue placeholder="Selecione um serviço" />
                      </SelectTrigger>
                      <SelectContent>
                        {clinic.services.map((service) => (
                          <SelectItem
                            key={service.id}
                            value={service.id}
                            className="cursor-pointer"
                          >
                            {service.name} - ({" "}
                            {Math.floor(service.duration / 60)}h{" "}
                            {service.duration % 60}min )
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  {/*Mensagem de erro*/}
                  <FormMessage />
                </FormItem>
              )}
            />

            {/*Horarios disponiveis*/}
            {selectedServiceId && (
              <div className="space-y-2">
                <Label className="font-semibold">Horários disponíveis:</Label>
                <div className="bg-gray-100 p-4 rounded-lg">
                  {loadingSlots ? (
                    <p>Carregando horários...</p>
                  ) : availableTimeSlots.length === 0 ? (
                    <p>Nenhum horário disponível</p>
                  ) : (
                    <ScheduleTimeList
                      onSelectTime={(time) => setSelectedTime(time)}
                      clinicTimes={clinic.times}
                      blockedTimes={blockedTimes}
                      availableTimeSlots={availableTimeSlots}
                      selectedTime={selectedTime}
                      selectedDate={selectedDate}
                      requiredSlots={
                        clinic.services.find(
                          (service) => service.id === selectedServiceId
                        )
                          ? Math.ceil(
                              clinic.services.find(
                                (service) => service.id === selectedServiceId
                              )!.duration / 30
                            )
                          : 1
                      }
                    />
                  )}
                </div>
              </div>
            )}

            {/*Botao para agendamento*/}
            {clinic.status ? (
              <Button
                type="submit"
                disabled={
                  !watch("name") ||
                  !watch("email") ||
                  !watch("phone") ||
                  !watch("date")
                }
                className="w-full bg-emerald-500 hover:bg-emerald-400 cursor-pointer"
              >
                Agendar Serviço
              </Button>
            ) : (
              <p className="bg-red-500 text-white text-center px-4 py-5 rounded-md">
                Clínica fechada
              </p>
            )}
          </form>
        </Form>
      </section>
    </div>
  );
}
