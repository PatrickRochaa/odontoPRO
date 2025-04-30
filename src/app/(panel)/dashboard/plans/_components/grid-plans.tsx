// Importa o botão responsável por iniciar a assinatura
import { SubscriptionButton } from './subscription-button'

// Importa os componentes estilizados do Card (usados para montar cada plano visualmente)
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card'

// Importa os dados dos planos de assinatura (nome, preço, descrição, etc.)
import { subscriptionPlans } from '@/utils/plans/index'

// Componente que renderiza todos os planos de assinatura em forma de grid
export function GridPlans() {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-5">
      {/* Mapeia cada plano da lista de planos */}
      {subscriptionPlans.map((plan, index) => (
        <Card
          key={plan.id} // Chave única para cada plano
          className={`flex flex-col w-full mx-auto ${index === 1 && "border-emerald-500"}`} // Aplica uma borda especial no segundo plano (PROFESSIONAL)
        >
          {/* Se for o segundo plano (índice 1), mostra uma faixa de destaque de promoção */}
          {index === 1 && (
            <div className='bg-emerald-500 w-full py-3 text-center rounded-t-xl -mt-6'>
              <p className='font-semibold text-white'>PROMOÇÃO EXCLUSIVA</p>
            </div>
          )}

          {/* Cabeçalho do card com nome e descrição do plano */}
          <CardHeader>
            <CardTitle className='text-xl md:text-2xl'>
              {plan.name} {/* Exibe o nome do plano */}
            </CardTitle>
            <CardDescription>
              {plan.description} {/* Exibe a descrição do plano */}
            </CardDescription>
          </CardHeader>

          {/* Corpo do card com as funcionalidades e preços */}
          <CardContent>
            {/* Lista de recursos inclusos no plano */}
            <ul className="list-disc list-inside space-y-2">
              {plan.features.map((feature, index) => (
                <li key={index} className='text-sm md:text-base'>
                  {feature} {/* Exibe cada funcionalidade incluída no plano */}
                </li>
              ))}
            </ul>

            {/* Preço atual e antigo (se houver) */}
            <div className='mt-4'>
              <p className='text-gray-600 line-through'>{plan.oldPrice}</p> {/* Preço anterior riscado */}
              <p className='text-black text-2xl font-bold'>{plan.price}</p> {/* Preço atual destacado */}
            </div>
          </CardContent>

          {/* Rodapé do card com o botão para assinar */}
          <CardFooter>
            <SubscriptionButton
              type={plan.id === "BASIC" ? "BASIC" : "PROFESSIONAL"} // Envia o tipo do plano como prop para o botão
            />
          </CardFooter>
        </Card>
      ))}
    </section>
  )
}
