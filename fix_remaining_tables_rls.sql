-- =============================================
-- FIX RLS FOR REMAINING TABLES (expenses, app_users, recurring_expense_templates)
-- Execute este SQL no Supabase SQL Editor
-- =============================================

-- =============================================
-- EXPENSES - Cada usuário vê apenas suas próprias despesas
-- =============================================

-- Remover políticas antigas se existirem
DROP POLICY IF EXISTS "Users can view own expenses" ON public.expenses;
DROP POLICY IF EXISTS "Users can insert own expenses" ON public.expenses;
DROP POLICY IF EXISTS "Users can update own expenses" ON public.expenses;
DROP POLICY IF EXISTS "Users can delete own expenses" ON public.expenses;

-- Criar políticas corretas
CREATE POLICY "Users can view own expenses"
ON public.expenses
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Users can insert own expenses"
ON public.expenses
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own expenses"
ON public.expenses
FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own expenses"
ON public.expenses
FOR DELETE
TO authenticated
USING (user_id = auth.uid());

-- Habilitar RLS
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;


-- =============================================
-- RECURRING_EXPENSE_TEMPLATES - Cada usuário vê apenas seus templates
-- =============================================

-- Remover políticas antigas se existirem
DROP POLICY IF EXISTS "Users can view own templates" ON public.recurring_expense_templates;
DROP POLICY IF EXISTS "Users can insert own templates" ON public.recurring_expense_templates;
DROP POLICY IF EXISTS "Users can update own templates" ON public.recurring_expense_templates;
DROP POLICY IF EXISTS "Users can delete own templates" ON public.recurring_expense_templates;

-- Criar políticas corretas
CREATE POLICY "Users can view own templates"
ON public.recurring_expense_templates
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Users can insert own templates"
ON public.recurring_expense_templates
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own templates"
ON public.recurring_expense_templates
FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own templates"
ON public.recurring_expense_templates
FOR DELETE
TO authenticated
USING (user_id = auth.uid());

-- Habilitar RLS
ALTER TABLE public.recurring_expense_templates ENABLE ROW LEVEL SECURITY;


-- =============================================
-- APP_USERS - Cada usuário vê apenas seu próprio perfil
-- =============================================

-- Remover políticas antigas se existirem
DROP POLICY IF EXISTS "Users can view own profile" ON public.app_users;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.app_users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.app_users;

-- Criar políticas corretas
CREATE POLICY "Users can view own profile"
ON public.app_users
FOR SELECT
TO authenticated
USING (auth_user_id = auth.uid());

CREATE POLICY "Users can insert own profile"
ON public.app_users
FOR INSERT
TO authenticated
WITH CHECK (auth_user_id = auth.uid());

CREATE POLICY "Users can update own profile"
ON public.app_users
FOR UPDATE
TO authenticated
USING (auth_user_id = auth.uid())
WITH CHECK (auth_user_id = auth.uid());

-- Habilitar RLS
ALTER TABLE public.app_users ENABLE ROW LEVEL SECURITY;


-- =============================================
-- REMOVER VIEWS INSEGURAS
-- =============================================

DROP VIEW IF EXISTS public.v_user_access CASCADE;
DROP VIEW IF EXISTS public.v_expenses_by_category CASCADE;
DROP VIEW IF EXISTS public.v_monthly_revenue CASCADE;
DROP VIEW IF EXISTS public.v_financial_summary CASCADE;
DROP VIEW IF EXISTS public.v_monthly_expenses CASCADE;


-- =============================================
-- VERIFICAR RESULTADO
-- =============================================

SELECT 
    tablename,
    policyname,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE schemaname = 'public'
AND tablename IN ('expenses', 'recurring_expense_templates', 'app_users')
ORDER BY tablename, policyname;


-- =============================================
-- VERIFICAR SE RLS ESTÁ HABILITADO EM TODAS AS TABELAS
-- =============================================

SELECT 
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('clients', 'appointments', 'employees', 'expenses', 'recurring_expense_templates', 'app_users')
ORDER BY tablename;

