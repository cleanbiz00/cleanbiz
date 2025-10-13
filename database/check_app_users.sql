-- Execute este código no SQL Editor do Supabase

-- 1. Verificar estrutura da tabela app_users
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'app_users' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 2. Verificar se existem dados na tabela
SELECT COUNT(*) as total_rows FROM app_users;

-- 3. Ver primeiras linhas (se existirem)
SELECT * FROM app_users LIMIT 3;
