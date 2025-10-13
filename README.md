# 🧹 CleanBiz - Sistema de Gerenciamento

Sistema completo de gestão para empresas de limpeza.

## 🚀 Tecnologias

- **Next.js 14** - Framework React
- **Supabase** - Banco de dados e autenticação
- **Tailwind CSS** - Estilização
- **TypeScript** - Tipagem
- **Google Calendar API** - Integração de calendário
- **React Big Calendar** - Visualização de agenda

## ✨ Funcionalidades

### 📊 Dashboard
- Visão geral do negócio
- Receita, despesas e lucro em tempo real
- Próximos agendamentos
- Clientes ativos

### 👥 Clientes
- Cadastro completo de clientes
- Nome, email, telefone, endereço
- Tipo de serviço

### 👨‍💼 Funcionários
- Cadastro de funcionários
- Nome, email, telefone, cargo

### 📅 Agenda
- **Visualização em calendário** colorida por funcionário
- **Visualização em lista**
- Agendamentos de 4 horas
- Horários em formato AM/PM
- Integração com Google Calendar
- Modal de detalhes com informações do cliente
- Status: Agendado, Confirmado, Concluído, Cancelado

### 💰 Financeiro
- Cálculo automático de receita (baseado em agendamentos)
- Gestão de despesas por categoria
- Gráfico de pizza (despesas por categoria)
- Gráfico de evolução anual (lucro/despesas)
- Cards de resumo: Receita, Despesas, Lucro

## 🔒 Segurança

- ✅ Row Level Security (RLS) habilitado
- ✅ Cada usuário vê apenas seus dados
- ✅ Autenticação via Supabase Auth
- ✅ 0 erros de segurança

## 📦 Instalação

```bash
# Instalar dependências
npm install

# Configurar variáveis de ambiente
# Copie .env.example para .env.local e preencha

# Rodar em desenvolvimento
npm run dev

# Build para produção
npm run build
npm start
```

## 🗄️ Banco de Dados

Todos os scripts SQL estão na pasta `/database/`.

Ver `database/README.md` para instruções de setup.

## 🌐 Deploy

Deploy automático na Vercel quando faz push para main.

## 📝 Estrutura do Projeto

```
src/
├── app/                  # Páginas Next.js (App Router)
│   ├── agenda/          # Página de agendamentos
│   ├── clientes/        # Página de clientes
│   ├── dashboard/       # Dashboard principal
│   ├── financeiro/      # Página financeira
│   ├── funcionarios/    # Página de funcionários
│   ├── login/           # Página de login
│   └── api/             # API Routes
│       ├── google-calendar/  # Integração Google
│       └── email/            # Envio de emails
├── components/          # Componentes React
│   ├── AppLayout.tsx    # Layout principal
│   └── Schedule/        # Componentes da agenda
└── utils/               # Utilitários
    ├── supabaseClient.ts
    └── timeFormat.ts
```

## 🎨 Features Destaque

- 🌈 Cores diferentes por funcionário na agenda
- 📍 Endereço do cliente nos eventos
- 🔔 Notificações por email
- 📊 Relatórios financeiros visuais
- 📱 Responsivo (mobile + desktop)
- 🔄 Sincronização em tempo real

## 📄 Documentação Adicional

- `INSTRUCOES_SUPABASE.md` - Setup do Supabase
- `GOOGLE_CALENDAR_SETUP.md` - Setup Google Calendar
- `ENVIRONMENT_VARIABLES.md` - Variáveis de ambiente
- `database/README.md` - Scripts do banco de dados

## 🆘 Suporte

Para dúvidas ou problemas, consulte a documentação ou abra uma issue.

---

**Desenvolvido com ❤️ para gestão eficiente de empresas de limpeza**
