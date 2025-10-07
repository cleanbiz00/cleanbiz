-- Execute no Supabase SQL Editor
-- Configurar políticas RLS corretas para app_users

-- 1. Reabilitar RLS
ALTER TABLE app_users ENABLE ROW LEVEL SECURITY;

-- 2. Remover políticas antigas (se existirem)
DROP POLICY IF EXISTS "Users can view own data" ON app_users;
DROP POLICY IF EXISTS "Users can update own data" ON app_users;
DROP POLICY IF EXISTS "Users can insert own data" ON app_users;

-- 3. Criar novas políticas simples e seguras

-- Política para SELECT: usuário pode ver apenas seus próprios dados
CREATE POLICY "Users can view own data" ON app_users
FOR SELECT
USING (auth.uid() = auth_user_id OR auth.uid()::text = id::text);

-- Política para UPDATE: usuário pode atualizar apenas seus próprios dados
CREATE POLICY "Users can update own data" ON app_users
FOR UPDATE
USING (auth.uid() = auth_user_id OR auth.uid()::text = id::text);

-- Política para INSERT: usuário pode inserir apenas seus próprios dados
CREATE POLICY "Users can insert own data" ON app_users
FOR INSERT
WITH CHECK (auth.uid() = auth_user_id OR auth.uid()::text = id::text);

-- 4. Permitir que o service role (servidor) acesse tudo
-- (Isso já funciona automaticamente com SUPABASE_SERVICE_ROLE_KEY)
