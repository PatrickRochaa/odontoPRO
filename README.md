# 🦷 OdontoPRO - Plataforma para Dentistas

OdontoPRO é uma plataforma desenvolvida com foco em clínicas e profissionais da odontologia. O sistema permite que dentistas cadastrem seus serviços, configurem horários de atendimento e gerenciem agendamentos realizados pelos pacientes de forma simples e eficaz.  
Criada com Next.js, React, TypeScript e Tailwind CSS, com manipulação de dados utilizando Prisma e PostgreSQL.

## 💡 Funcionalidades

### 👨‍⚕️ Dentista (Profissional):
- Autenticação via **Google (NextAuth.js)**.
- Cadastro de **serviços odontológicos** com tempo estimado.
- Limite de serviços conforme o **plano contratado**.
- Cadastro de **telefone, endereço e foto da clínica**.
- Definição de **horários de funcionamento** semanais.
- Gerenciamento completo de **agendamentos recebidos**.
- Interface moderna, limpa e responsiva.
- **Botão de logout acessível em todo o painel**, facilitando a saída da conta de qualquer página, implementada como melhoria além do escopo do curso original.
- **Página personalizada de "Not Found" (404)**, implementada como melhoria além do escopo do curso original.

### 👥 Cliente (Paciente):
- Visualização do perfil do dentista (serviços, horários e contato).
- Agendamento de serviços apenas em **horários disponíveis**.
- Prevenção contra agendamentos em horários já ocupados ou inválidos.
- Confirmação visual do agendamento realizado.

## 📦 Tecnologias utilizadas

- **Next.js (App Router)**
- **React**
- **TypeScript**
- **Tailwind CSS**
- **Prisma ORM**
- **PostgreSQL**
- **NextAuth.js**
- **Lucide React**
- **Stripe** (para gerenciamento de planos)
- **Zod** (validações)
- **React Hook Form**
- **Sonner** (notificações personalizadas)
