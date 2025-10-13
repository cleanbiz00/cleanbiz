-- Execute no Supabase SQL Editor para verificar seu usuário

-- 1. Ver seu usuário no auth.users
SELECT id, email, created_at FROM auth.users WHERE email = 'cleanbiz00@gmail.com';

-- 2. Ver se existe registro em app_users
SELECT * FROM app_users;

-- 3. Criar/atualizar registro se necessário (execute DEPOIS de ver os resultados acima)
-- Substitua 'SEU-USER-ID-AQUI' pelo id que apareceu na query 1
-- INSERT INTO app_users (auth_user_id) VALUES ('SEU-USER-ID-AQUI')
-- ON CONFLICT (auth_user_id) DO NOTHING;
