// Define que esse componente roda no cliente (não no servidor)
"use client";

// Importa os componentes do cabeçalho do Dialog (modal)
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

// Importa o hook personalizado do formulário e o tipo dos dados
import {
  useDialogServiceForm,
  DialogServiceFormData,
} from "./dialog-service-form";

// Importa componentes do sistema de formulário para estrutura e validação
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

// Importa o useState para controlar estados e o useRouter para navegar
import { useState } from "react";
import { useRouter } from "next/navigation";

// Importa o componente de input e botão reutilizáveis do projeto
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// Função utilitária para converter valor em reais para centavos
import { convertRealToCents } from "@/utils/convertCurrency";

// Importa as ações do servidor para criar ou atualizar um serviço
import { createNewService } from "../_actions/create-service";
import { updateService } from "../_actions/update-service";

// Importa a função de toast para exibir notificações visuais
import { toast } from "sonner";

// Define as propriedades esperadas no componente do Dialog de Serviço
interface DialogServiceProps {
  closeModal: () => void; // Função para fechar o modal
  serviceId?: string; // ID do serviço (se estiver editando)
  initialValues?: {
    // Valores iniciais para edição
    name: string;
    price: string;
    hours: string;
    minutes: string;
  };
}

// Componente principal que renderiza o modal de criação/edição de serviço
export function DialogService({
  closeModal, // Função para fechar o modal
  serviceId, // ID do serviço (se estiver editando)
  initialValues, // Valores iniciais para preenchimento dos campos
}: DialogServiceProps) {
  // Hook que inicializa o formulário com ou sem valores iniciais
  const form = useDialogServiceForm({ initialValues: initialValues });

  // Estado de loading para desabilitar botão e mostrar feedback enquanto processa
  const [loading, setLoading] = useState(false);

  // Hook para redirecionamento ou atualização da rota
  const router = useRouter();

  //funçao para adicionar serviços
  async function onSubmit(values: DialogServiceFormData) {
    setLoading(true);
    const priceInCents = convertRealToCents(values.price);
    const hours = parseInt(values.hours) || 0;
    const minutes = parseInt(values.minutes) || 0;

    // Converter as horas e minutos para duração total em minutos;
    const duration = hours * 60 + minutes;

    if (serviceId) {
      await editServiceById({
        serviceId: serviceId,
        name: values.name,
        priceInCents: priceInCents,
        duration: duration,
      });
      //parando o loading
      setLoading(false);
      return;
    }

    const response = await createNewService({
      name: values.name,
      price: priceInCents,
      duration: duration,
    });

    //parando o loading
    setLoading(false);

    if (response.error) {
      toast.error(response.error);
    }
    toast.success("Serviço cadastrado com sucesso.");
    //chamando funçao que fechar o modal
    handleCloseModal();
    router.refresh();
  }

  //funçao para fechar o modal
  function handleCloseModal() {
    //limpando os campos do formularios do modal
    form.reset();
    closeModal();
  }

  //funçao para Formatar automaticamente um valor digitado
  function changeCurrency(event: React.ChangeEvent<HTMLInputElement>) {
    let { value } = event.target;

    // Remove tudo que não for número
    value = value.replace(/\D/g, "");

    if (value) {
      // Transforma em número inteiro e divide por 100 para ter centavos
      value = (parseInt(value, 10) / 100).toFixed(2);

      // Troca ponto decimal por vírgula (padrão brasileiro)
      value = value.replace(".", ",");

      // Coloca ponto a cada 3 dígitos antes da vírgula (ex: 1.000,00)
      value = value.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

      // Define o novo valor formatado no input
      event.target.value = value;

      // Atualiza o estado do formulário com o novo valor
      form.setValue("price", value);
    }
  }

  // Função assíncrona para editar um serviço existente
  async function editServiceById({
    serviceId,
    name,
    priceInCents,
    duration,
  }: {
    serviceId: string; // ID do serviço a ser editado
    name: string; // Nome atualizado do serviço
    priceInCents: number; // Preço do serviço (em centavos)
    duration: number; // Duração total do serviço (em minutos)
  }) {
    // Chama a função que faz a requisição para atualizar o serviço no backend
    const response = await updateService({
      serviceId: serviceId, // Passa o ID do serviço
      name: name, // Passa o nome atualizado
      price: priceInCents, // Passa o preço atualizado (em centavos)
      duration: duration, // Passa a nova duração (em minutos)
    });

    // Para o estado de "carregando" após a requisição
    setLoading(false);

    // Verifica se a resposta contém erro
    if (response.error) {
      // Exibe uma notificação de erro usando a biblioteca "sonner"
      toast.error(response.error);
      return; // Encerra a função se houver erro
    }

    // Caso a atualização seja bem-sucedida, exibe mensagem de sucesso
    toast.success(response.data);

    // Fecha o modal e reseta o formulário
    handleCloseModal();
  }

  return (
    <>
      {/* Cabeçalho do modal */}
      <DialogHeader>
        <DialogTitle>Novo Serviço</DialogTitle> {/* Título principal */}
        <DialogDescription>Adicione um novo serviço</DialogDescription>{" "}
        {/* Descrição */}
      </DialogHeader>

      {/* Componente de formulário utilizando React Hook Form */}
      <Form {...form}>
        {/* Formulário principal */}
        <form className="space-y-2" onSubmit={form.handleSubmit(onSubmit)}>
          {/* Container para os campos principais */}
          <div className="flex flex-col">
            {/* Campo: Nome do serviço */}
            <FormField
              control={form.control} // Controlador do React Hook Form
              name="name" // Nome do campo no schema
              render={({ field }) => (
                <FormItem className="my-2">
                  <FormLabel className="font-semibold">
                    Nome do serviço:
                  </FormLabel>
                  <FormControl>
                    {/* Input para digitar o nome do serviço */}
                    <Input
                      {...field}
                      placeholder="Digite o nome do serviço..."
                    />
                  </FormControl>
                  <FormMessage /> {/* Exibe mensagens de erro de validação */}
                </FormItem>
              )}
            />

            {/* Campo: Valor do serviço */}
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem className="my-2">
                  <FormLabel className="font-semibold">
                    Valor do serviço:
                  </FormLabel>
                  <FormControl>
                    {/* Input para digitar o preço, com formatação automática */}
                    <Input
                      {...field}
                      placeholder="Ex: 120,00"
                      onChange={changeCurrency} // Função para formatar valor digitado
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Texto informativo para duração do serviço */}
          <p className="font-semibold">Tempo de duração do serviço:</p>

          {/* Grid com dois inputs lado a lado: horas e minutos */}
          <div className="grid grid-cols-2 gap-3">
            {/* Campo: Horas */}
            <FormField
              control={form.control}
              name="hours"
              render={({ field }) => (
                <FormItem className="my-2">
                  <FormLabel className="font-semibold">Horas:</FormLabel>
                  <FormControl>
                    {/* Input para digitar o número de horas */}
                    <Input {...field} placeholder="1" min="0" type="number" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Campo: Minutos */}
            <FormField
              control={form.control}
              name="minutes"
              render={({ field }) => (
                <FormItem className="my-2">
                  <FormLabel className="font-semibold">Minutos:</FormLabel>
                  <FormControl>
                    {/* Input para digitar o número de minutos */}
                    <Input {...field} placeholder="0" min="0" type="number" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Botão para enviar o formulário */}
          <Button
            type="submit"
            className="w-full font-semibold text-white cursor-pointer"
            disabled={loading} // Desabilita o botão enquanto carrega
          >
            {/* Texto condicional: mostra "Cadastrando..." durante loading, ou o texto de acordo com o modo (novo ou edição) */}
            {loading
              ? "Cadastrando..."
              : `${serviceId ? "Atualizar Serviço" : "Adicionar Serviço"}`}
          </Button>
        </form>
      </Form>
    </>
  );
}
