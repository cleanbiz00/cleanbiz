# Painel Administrativo SaaS - CleanBiz360

## 🔐 Acesso Restrito

Este painel é **exclusivo para administradores** e não aparece no menu lateral.

## 📧 Como Configurar seu Acesso

1. **Abra o arquivo:** `src/app/admin/layout.tsx`
2. **Encontre a seção:** `ADMIN_EMAILS`
3. **Adicione seu email** na lista:

```typescript
const ADMIN_EMAILS = [
  'seu-email@exemplo.com', // ← Adicione seu email aqui
  'arthur@gmail.com',      // ← Email alternativo se necessário
]
```

## 🚀 Como Acessar

1. **Faça login** no sistema normalmente
2. **Digite na URL:** `localhost:3000/admin` (ou `app.cleanbiz360.com/admin` em produção)
3. **Sistema verifica** automaticamente se seu email está autorizado
4. **Se autorizado:** Acessa o painel
5. **Se não autorizado:** Redireciona para o dashboard

## 🛡️ Segurança

- ✅ **Email obrigatório:** Apenas emails específicos podem acessar
- ✅ **Autenticação:** Usuário deve estar logado
- ✅ **Redirecionamento:** Não autorizados são redirecionados
- ✅ **Não visível:** Não aparece no menu lateral

## 📊 Funcionalidades do Painel

- **💰 Receita Mensal/Anual**
- **🎯 MRR (Monthly Recurring Revenue)**
- **👥 Clientes Pagantes/Ativos**
- **⚠️ Churn Rate**
- **📈 Status dos Sistemas** (Vercel, Supabase, GitHub, Domínios)
- **📊 Uso de Recursos** (API Calls, Storage, Bandwidth)
- **👤 Resumo de Clientes**

## 🔧 Configuração de Produção

Para configurar em produção, certifique-se de:

1. **Adicionar seu email** na lista `ADMIN_EMAILS`
2. **Testar o acesso** antes de fazer deploy
3. **Manter a lista atualizada** se precisar adicionar outros admins

## 📝 Notas Importantes

- O painel usa dados **reais** do Supabase quando possível
- Em caso de erro nas APIs, mostra **dados simulados**
- Todas as métricas são **calculadas automaticamente**
- Interface **responsiva** e **profissional**
