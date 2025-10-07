-- Script para verificar a estrutura da tabela app_users
-- Execute no Supabase SQL Editor

-- Ver estrutura da tabela
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'app_users' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Ver dados existentes (primeiras 3 linhas)
SELECT * FROM app_users LIMIT 3;
