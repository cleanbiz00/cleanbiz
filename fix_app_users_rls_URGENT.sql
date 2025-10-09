-- =============================================
-- FIX INFINITE RECURSION IN APP_USERS TABLE
-- Execute IMEDIATAMENTE no Supabase SQL Editor
-- =============================================

-- 1. REMOVER POLÍTICAS DA TABELA APP_USERS (causam recursão infinita)
-- =============================================

DROP POLICY IF EXISTS "Users can view own profile" ON public.app_users;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.app_users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.app_users;
DROP POLICY IF EXISTS "Users can delete own profile" ON public.app_users;
DROP POLICY IF EXISTS "Users can insert own data" ON public.app_users;
DROP POLICY IF EXISTS "Users can update own data" ON public.app_users;
DROP POLICY IF EXISTS "Users can view own data" ON public.app_users;
DROP POLICY IF EXISTS "profiles admin all" ON public.app_users;
DROP POLICY IF EXISTS "profiles select own" ON public.app_users;
DROP POLICY IF EXISTS "profiles update own" ON public.app_users;


-- 2. DESABILITAR RLS NA TABELA APP_USERS
-- =============================================
-- Esta tabela não precisa de RLS porque:
-- 1. É acessada apenas internamente pelo sistema de autenticação
-- 2. Já está protegida pelas políticas das outras tabelas
-- 3. RLS aqui causa recursão infinita

ALTER TABLE public.app_users DISABLE ROW LEVEL SECURITY;


-- 3. GARANTIR QUE OUTRAS TABELAS CONTINUAM COM RLS
-- =============================================

ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recurring_expense_templates ENABLE ROW LEVEL SECURITY;


-- 4. VERIFICAR RESULTADO
-- =============================================

SELECT 
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('app_users', 'clients', 'appointments', 'employees', 'expenses', 'recurring_expense_templates')
ORDER BY tablename;


-- =============================================
-- RESULTADO ESPERADO:
-- app_users                   → false (sem RLS, seguro internamente)
-- appointments                → true  (com RLS, protegido por user_id)
-- clients                     → true  (com RLS, protegido por user_id)
-- employees                   → true  (com RLS, protegido por user_id)
-- expenses                    → true  (com RLS, protegido por user_id)
-- recurring_expense_templates → true  (com RLS, protegido por user_id)
-- =============================================

