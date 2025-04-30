// Importa o zodResolver para conectar o schema de validação com o react-hook-form
import { zodResolver } from "@hookform/resolvers/zod";

// Importa o hook principal do react-hook-form
import { useForm } from "react-hook-form";

// Importa o Zod, biblioteca de validação de dados
import { z } from "zod";

// Define a interface com as props esperadas pelo hook personalizado
interface UseProfileFormProps {
  name: string | null; // Nome do usuário (pode ser nulo)
  address: string | null; // Endereço (pode ser nulo)
  phone: string | null; // Telefone (pode ser nulo)
  status: boolean; // Status (ativo ou inativo)
  timeZone: string | null; // Fuso horário (pode ser nulo)
}

// Cria o schema de validação do formulário usando Zod
const profileSchema = z.object({
  name: z.string().min(1, { message: "O nome é obrigatório" }), // Nome é obrigatório
  address: z.string().optional(), // Endereço é opcional
  phone: z.string().optional(), // Telefone é opcional
  status: z.string(), // Status deve ser string (ex: "active" ou "inactive")
  timeZone: z.string().min(1, { message: "O time zone é obrigatório" }), // Fuso horário é obrigatório
});

// Cria um tipo TypeScript com base no schema criado
export type ProfileFormData = z.infer<typeof profileSchema>;

// Hook personalizado que encapsula a lógica do useForm com zod e valores padrão
export function useProfileForm({
  name,
  address,
  phone,
  status,
  timeZone,
}: UseProfileFormProps) {
  return useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema), // Usa o schema do Zod para validar o formulário
    defaultValues: {
      name: name || "", // Valor padrão para o nome (string vazia se for nulo)
      address: address || "", // Valor padrão para o endereço
      phone: phone || "", // Valor padrão para o telefone
      status: status ? "active" : "inactive", // Converte booleano para string ("active"/"inactive")
      timeZone: timeZone || "", // Valor padrão para o fuso horário
    },
  });
}
