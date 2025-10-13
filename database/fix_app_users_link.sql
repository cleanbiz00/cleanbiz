-- Execute no Supabase SQL Editor
-- Adiciona coluna para linkar com auth.users

ALTER TABLE app_users 
ADD COLUMN IF NOT EXISTS auth_user_id UUID REFERENCES auth.users(id);

-- Criar índice para performance
CREATE INDEX IF NOT EXISTS idx_app_users_auth_user_id 
ON app_users(auth_user_id);

-- Se você já tem uma linha na tabela, vincule ao seu usuário atual:
-- (Substitua 'seu-email@aqui.com' pelo email que você usa para fazer login)
UPDATE app_users 
SET auth_user_id = (SELECT id FROM auth.users WHERE email = 'cleanbiz00@gmail.com' LIMIT 1)
WHERE auth_user_id IS NULL;
