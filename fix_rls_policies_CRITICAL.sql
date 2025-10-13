-- =============================================
-- CRITICAL FIX: RECREATE RLS POLICIES WITH PROPER USER_ID FILTERING
-- Execute este SQL no Supabase SQL Editor
-- =============================================

-- IMPORTANTE: Estas políticas garantem que cada usuário veja APENAS seus próprios dados!

-- =============================================
-- 1. REMOVER POLÍTICAS ANTIGAS (PERMISSIVAS DEMAIS)
-- =============================================

-- Remover políticas de clients
DROP POLICY IF EXISTS "auth delete clients" ON public.clients;
DROP POLICY IF EXISTS "auth read clients" ON public.clients;
DROP POLICY IF EXISTS "auth update clients" ON public.clients;
DROP POLICY IF EXISTS "auth write clients" ON public.clients;

-- Remover políticas de appointments
DROP POLICY IF EXISTS "auth delete appointments" ON public.appointments;
DROP POLICY IF EXISTS "auth read appointments" ON public.appointments;
DROP POLICY IF EXISTS "auth update appointments" ON public.appointments;
DROP POLICY IF EXISTS "auth write appointments" ON public.appointments;

-- Remover políticas de employees
DROP POLICY IF EXISTS "auth delete employees" ON public.employees;
DROP POLICY IF EXISTS "auth read employees" ON public.employees;
DROP POLICY IF EXISTS "auth update employees" ON public.employees;
DROP POLICY IF EXISTS "auth write employees" ON public.employees;


-- =============================================
-- 2. CRIAR POLÍTICAS CORRETAS (FILTRADAS POR USER_ID)
-- =============================================

-- CLIENTS - Cada usuário vê apenas seus próprios clientes
-- =============================================

CREATE POLICY "Users can view own clients"
ON public.clients
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Users can insert own clients"
ON public.clients
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own clients"
ON public.clients
FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own clients"
ON public.clients
FOR DELETE
TO authenticated
USING (user_id = auth.uid());


-- APPOINTMENTS - Cada usuário vê apenas seus próprios agendamentos
-- =============================================

CREATE POLICY "Users can view own appointments"
ON public.appointments
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Users can insert own appointments"
ON public.appointments
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own appointments"
ON public.appointments
FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own appointments"
ON public.appointments
FOR DELETE
TO authenticated
USING (user_id = auth.uid());


-- EMPLOYEES - Cada usuário vê apenas seus próprios funcionários
-- =============================================

CREATE POLICY "Users can view own employees"
ON public.employees
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Users can insert own employees"
ON public.employees
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own employees"
ON public.employees
FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own employees"
ON public.employees
FOR DELETE
TO authenticated
USING (user_id = auth.uid());


-- =============================================
-- 3. HABILITAR RLS EM TODAS AS TABELAS
-- =============================================

ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;


-- =============================================
-- 4. VERIFICAR SE AS POLÍTICAS ESTÃO CORRETAS
-- =============================================

SELECT 
    tablename,
    policyname,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE schemaname = 'public'
AND tablename IN ('clients', 'appointments', 'employees')
ORDER BY tablename, policyname;


-- =============================================
-- RESULTADO ESPERADO:
-- Todas as políticas devem ter: (user_id = auth.uid())
-- Isso garante que cada usuário veja APENAS seus próprios dados!
-- =============================================



