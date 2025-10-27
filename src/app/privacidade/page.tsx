export default function PrivacidadePage() {
  return (
    <div className="max-w-4xl mx-auto p-8 prose prose-slate dark:prose-invert">
      <h1>Política de Privacidade</h1>
      <p className="text-sm text-gray-600 dark:text-gray-400">Última atualização: {new Date().toLocaleDateString('pt-BR')}</p>

      <h2>1. Introdução</h2>
      <p>
        Esta Política de Privacidade descreve como o CleanBiz360 coleta, usa e protege suas informações pessoais 
        quando você utiliza nosso serviço de gerenciamento para empresas de limpeza.
      </p>

      <h2>2. Informações que Coletamos</h2>
      <p>Coletamos as seguintes informações para fornecer nossos serviços:</p>
      <ul>
        <li><strong>Dados da conta:</strong> nome, email, senha (criptografada)</li>
        <li><strong>Dados de clientes:</strong> nome, email, telefone, endereço completo</li>
        <li><strong>Dados de funcionários:</strong> nome, email, telefone</li>
        <li><strong>Dados de agendamentos:</strong> data, hora, serviço, valor, status, comentários</li>
        <li><strong>Dados financeiros:</strong> receitas e despesas</li>
        <li><strong>Integração Google Calendar:</strong> tokens de acesso para sincronização</li>
      </ul>

      <h2>3. Como Utilizamos Suas Informações</h2>
      <p>Utilizamos suas informações para:</p>
      <ul>
        <li>Criar e gerenciar agendamentos de serviços</li>
        <li>Enviar confirmações de agendamento via email</li>
        <li>Sincronizar eventos com o Google Calendar</li>
        <li>Gerenciar clientes e funcionários</li>
        <li>Controlar receitas e despesas financeiras</li>
        <li>Melhorar nossos serviços e funcionalidades</li>
      </ul>

      <h2>4. Compartilhamento de Informações</h2>
      <p>Seus dados são compartilhados apenas nas seguintes situações:</p>
      <ul>
        <li><strong>Google Calendar:</strong> quando você conecta sua conta do Google, 
          compartilhamos informações de agendamentos para sincronizar eventos. Nenhum dado 
          financeiro (valores) é compartilhado com funcionários no Google Calendar.</li>
        <li><strong>Emails de confirmação:</strong> enviamos notificações aos clientes e funcionários 
          sobre os agendamentos, sem incluir valores financeiros para funcionários.</li>
      </ul>
      <p>Não vendemos, alugamos ou compartilhamos seus dados com terceiros para fins comerciais.</p>

      <h2>5. Segurança dos Dados</h2>
      <p>
        Utilizamos tecnologias modernas de segurança para proteger seus dados:
      </p>
      <ul>
        <li><strong>Supabase:</strong> banco de dados com criptografia em trânsito e em repouso</li>
        <li><strong>Vercel:</strong> hospedagem segura com certificados SSL</li>
        <li><strong>Autenticação:</strong> senhas são criptografadas usando hash seguro</li>
        <li><strong>Acesso:</strong> apenas você tem acesso aos seus dados através de autenticação</li>
      </ul>

      <h2>6. Seus Direitos</h2>
      <p>Você tem o direito de:</p>
      <ul>
        <li>Acessar seus dados pessoais</li>
        <li>Corrigir informações incorretas</li>
        <li>Excluir sua conta e dados associados</li>
        <li>Desconectar integrações (Google Calendar)</li>
        <li>Solicitar uma cópia dos seus dados</li>
      </ul>
      <p>Para exercer esses direitos, entre em contato conosco através do email da sua conta.</p>

      <h2>7. Cookies e Tecnologias de Rastreamento</h2>
      <p>
        Utilizamos cookies essenciais para autenticação e funcionamento do sistema. 
        Não utilizamos cookies para publicidade ou rastreamento de terceiros.
      </p>

      <h2>8. Retenção de Dados</h2>
      <p>
        Mantemos seus dados enquanto você usar nosso serviço. Você pode excluir sua conta 
        a qualquer momento através das configurações do sistema. Após exclusão, seus dados 
        serão removidos permanentemente em até 30 dias.
      </p>

      <h2>9. Privacidade de Menores</h2>
      <p>
        Nosso serviço não é destinado a menores de 18 anos. Não coletamos intencionalmente 
        informações de menores.
      </p>

      <h2>10. Alterações nesta Política</h2>
      <p>
        Podemos atualizar esta Política de Privacidade periodicamente. Notificaremos você 
        sobre mudanças significativas através de email ou notificação no sistema.
      </p>

      <h2>11. Contato</h2>
      <p>
        Se você tiver dúvidas sobre esta Política de Privacidade, entre em contato conosco 
        através da sua conta no sistema.
      </p>

      <h2>12. LGPD</h2>
      <p>
        Esta Política está de acordo com a Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018). 
        Respeitamos seus direitos de privacidade e transparência sobre o uso de seus dados pessoais.
      </p>

      <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
        <a href="/dashboard" className="text-teal-600 dark:text-teal-400 hover:underline">
          ← Voltar ao Dashboard
        </a>
      </div>
    </div>
  )
}

