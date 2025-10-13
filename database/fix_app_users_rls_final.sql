-- =============================================
-- CORRIGIR RLS EM APP_USERS (SOLUÇÃO FINAL)
-- Execute este SQL no Supabase SQL Editor
-- =============================================

-- Esta tabela app_users é APENAS para relacionar auth.users com google tokens
-- Ela NÃO deve ser acessível diretamente via API (PostgREST)

-- 1. Remover tabela do schema público exposto ao PostgREST
-- Isso resolve o alerta de segurança
ALTER TABLE public.app_users SET SCHEMA auth;

-- OU, se preferir manter no public mas protegida:

-- 2. Habilitar RLS
ALTER TABLE public.app_users ENABLE ROW LEVEL SECURITY;

-- 3. Criar política que permite apenas o próprio usuário
CREATE POLICY "Users can only view own data"
ON public.app_users
FOR SELECT
TO authenticated
USING (auth_user_id = auth.uid());

CREATE POLICY "Users can only update own data"
ON public.app_users
FOR UPDATE
TO authenticated
USING (auth_user_id = auth.uid())
WITH CHECK (auth_user_id = auth.uid());

-- Bloquear INSERT e DELETE (devem ser feitos via triggers ou functions)
CREATE POLICY "Block direct insert"
ON public.app_users
FOR INSERT
TO authenticated
WITH CHECK (false);

CREATE POLICY "Block direct delete"
ON public.app_users
FOR DELETE
TO authenticated
USING (false);

-- =============================================
-- VERIFICAÇÃO
-- =============================================
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables 
WHERE tablename = 'app_users';

-- Deve mostrar rowsecurity = true

