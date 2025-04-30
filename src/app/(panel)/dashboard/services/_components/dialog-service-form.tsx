// Importa o adaptador do Zod para funcionar com o react-hook-form
import { zodResolver } from "@hookform/resolvers/zod";
// Importa o Zod para fazer validação de schema
import { z } from "zod";
// Importa o hook principal do react-hook-form
import { useForm } from "react-hook-form";

// Define o schema de validação usando Zod
const formSchema = z.object({
  name: z.string().min(1, { message: "O nome do serviço é obrigatório" }), // Campo obrigatório
  price: z.string().min(1, { message: "O preço do serviço é obrigatório" }), // Campo obrigatório (string aqui, será convertido depois)
  hours: z.string(), // Pode ser vazio
  minutes: z.string(), // Pode ser vazio
});

// Define o tipo opcional para receber valores iniciais no formulário
export interface UseDialogServiceFormProps {
  initialValues?: {
    name: string;
    price: string;
    hours: string;
    minutes: string;
  };
}

// Cria o tipo TypeScript com base no schema do Zod
export type DialogServiceFormData = z.infer<typeof formSchema>;

// Hook personalizado para lidar com o formulário de serviço em um modal/dialog
export function useDialogServiceForm({
  initialValues, // Valores iniciais (caso esteja editando um serviço, por exemplo)
}: UseDialogServiceFormProps) {
  return useForm<DialogServiceFormData>({
    // Usa o schema do Zod como validador do formulário
    resolver: zodResolver(formSchema),
    // Define valores padrão, se não tiver `initialValues`, usa valores vazios
    defaultValues: initialValues || {
      name: "",
      price: "",
      hours: "",
      minutes: "",
    },
  });
}
