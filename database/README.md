# Database Scripts

Esta pasta contém todos os scripts SQL para configuração e manutenção do banco de dados Supabase.

## 📋 Scripts Importantes (Execute nesta ordem se for configurar do zero):

### 1. Criação de Tabelas:
- `create_all_tables.sql` - Cria todas as tabelas principais
- `create_appointments_table.sql` - Tabela de agendamentos
- `supabase_migration_google_tokens.sql` - Adiciona campos do Google Calendar

### 2. Segurança (RLS - Row Level Security):
- `fix_rls_policies_CRITICAL.sql` - **IMPORTANTE** - Políticas de segurança corretas
- `fix_remaining_tables_rls.sql` - Completa RLS em todas as tabelas
- `fix_app_users_rls_URGENT.sql` - Corrige recursão infinita em app_users
- `setup_rls_policies.sql` - Setup inicial de RLS

### 3. Correções e Ajustes:
- `add_client_email_column.sql` - Adiciona coluna client_email em appointments
- `fix_app_users_link.sql` - Corrige links de auth_user_id

### 4. Debug e Verificação:
- `check_app_users.sql` - Verifica usuários
- `check_current_user.sql` - Verifica usuário atual
- `debug_table_structure.sql` - Debug de estrutura
- `fix_security_issues.sql` - Lista problemas de segurança

## ⚠️ Status Atual:

✅ **Todos os scripts já foram executados com sucesso!**
✅ **RLS habilitado e funcionando**
✅ **0 erros de segurança no Supabase**

Estes arquivos servem como **documentação e backup** das configurações do banco.

## 🔒 Segurança:

Todas as tabelas têm RLS (Row Level Security) habilitado:
- `clients` - Cada usuário vê apenas seus clientes
- `employees` - Cada usuário vê apenas seus funcionários
- `appointments` - Cada usuário vê apenas seus agendamentos
- `expenses` - Cada usuário vê apenas suas despesas
- `recurring_expense_templates` - Templates isolados por usuário

## 📝 Nota:

Se precisar recriar o banco do zero ou configurar outro ambiente, execute os scripts na ordem indicada acima.

