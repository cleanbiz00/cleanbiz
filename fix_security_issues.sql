-- =============================================
-- FIX SECURITY ISSUES - ENABLE RLS ON ALL TABLES
-- Execute este SQL no Supabase SQL Editor
-- =============================================

-- 1. HABILITAR RLS EM TODAS AS TABELAS
-- =============================================

-- Habilitar RLS na tabela clients
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;

-- Habilitar RLS na tabela appointments
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- Habilitar RLS na tabela employees
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;

-- Habilitar RLS na tabela app_users
ALTER TABLE public.app_users ENABLE ROW LEVEL SECURITY;

-- Habilitar RLS na tabela expenses (se existir)
ALTER TABLE IF EXISTS public.expenses ENABLE ROW LEVEL SECURITY;

-- Habilitar RLS na tabela recurring_expense_templates (se existir)
ALTER TABLE IF EXISTS public.recurring_expense_templates ENABLE ROW LEVEL SECURITY;


-- 2. REMOVER VIEWS PROBLEMÁTICAS
-- =============================================

-- Remover view que expõe auth.users
DROP VIEW IF EXISTS public.v_user_access CASCADE;

-- Remover views com SECURITY DEFINER (recriar sem essa propriedade se necessário)
DROP VIEW IF EXISTS public.v_expenses_by_category CASCADE;
DROP VIEW IF EXISTS public.v_monthly_revenue CASCADE;
DROP VIEW IF EXISTS public.v_financial_summary CASCADE;
DROP VIEW IF EXISTS public.v_monthly_expenses CASCADE;


-- 3. VERIFICAR SE RLS ESTÁ HABILITADO
-- =============================================

SELECT 
    schemaname,
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('clients', 'appointments', 'employees', 'app_users', 'expenses', 'recurring_expense_templates')
ORDER BY tablename;


-- 4. LISTAR POLÍTICAS RLS ATIVAS
-- =============================================

SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;


-- =============================================
-- RESULTADO ESPERADO:
-- Todas as tabelas devem mostrar rls_enabled = true
-- As views problemáticas devem estar removidas
-- =============================================



