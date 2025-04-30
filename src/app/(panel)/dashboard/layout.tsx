// Importa o componente da sidebar do dashboard
import { SidebarDashboard } from "./_components/sidebar";

// Componente que define o layout do Dashboard
// Ele recebe os "children" (conteúdo interno) como propriedade
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode; // Define que o tipo de children é um elemento React
}) {
  return (
    <>
      {/* Renderiza a SidebarDashboard envolvendo o conteúdo da página */}
      <SidebarDashboard>{children}</SidebarDashboard>
    </>
  );
}
