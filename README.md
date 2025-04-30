# 🦷 OdontoPRO - Plataforma para Dentistas

OdontoPRO é uma plataforma desenvolvida com foco em clínicas e profissionais da odontologia. O sistema permite que dentistas cadastrem seus serviços, configurem horários de atendimento e gerenciem agendamentos realizados pelos pacientes de forma simples e eficaz.

## 💡 Funcionalidades

### 👨‍⚕️ Dentista (Profissional):
- Autenticação via **Google (NextAuth.js)**.
- Cadastro de **serviços odontológicos** com tempo estimado.
- Limite de serviços baseado no **plano contratado**.
- Cadastro de **telefone, endereço e foto da clínica**.
- Definição de **horários de funcionamento**.
- Gerenciamento de **agendamentos recebidos**.
- Interface limpa e responsiva.

### 👥 Cliente (Paciente):
- Visualização do perfil do dentista (serviços, horários, contato).
- Agendamento de serviços apenas em **horários disponíveis**.
- Prevenção contra agendamentos duplicados ou fora do horário.
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
