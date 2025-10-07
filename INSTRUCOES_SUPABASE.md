# 📋 Instruções para Configurar o Supabase

## ⚠️ IMPORTANTE: Execute antes de testar!

Antes de testar a conexão do Google Calendar, você precisa adicionar as colunas no banco de dados do Supabase.

---

## 🔧 Passo a Passo:

### 1. Acesse o Supabase Dashboard
- Vá para: https://supabase.com/dashboard
- Faça login
- Selecione seu projeto: **cleanbiz**

### 2. Abra o SQL Editor
- No menu lateral esquerdo, clique em **"SQL Editor"**
- Clique em **"New query"** (ou "+")

### 3. Cole o script SQL
Cole o seguinte código no editor SQL:

```sql
-- Migration: Add Google OAuth tokens to users table
-- Execute this script in Supabase SQL Editor

-- Add columns for Google OAuth tokens
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS google_access_token TEXT,
ADD COLUMN IF NOT EXISTS google_refresh_token TEXT,
ADD COLUMN IF NOT EXISTS google_token_expires_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS google_connected_at TIMESTAMP WITH TIME ZONE;

-- Add index for better performance
CREATE INDEX IF NOT EXISTS idx_users_google_token ON users(google_access_token) WHERE google_access_token IS NOT NULL;

-- Add comment for documentation
COMMENT ON COLUMN users.google_access_token IS 'Google Calendar OAuth access token';
COMMENT ON COLUMN users.google_refresh_token IS 'Google Calendar OAuth refresh token';
COMMENT ON COLUMN users.google_token_expires_at IS 'Expiration time of the access token';
COMMENT ON COLUMN users.google_connected_at IS 'When the user connected their Google Calendar';
```

### 4. Execute o script
- Clique no botão **"Run"** (ou pressione Ctrl+Enter)
- Aguarde a mensagem de sucesso: **"Success. No rows returned"**

### 5. Verificar se funcionou
- Vá para **"Table Editor"** no menu lateral
- Clique na tabela **"users"**
- Você deve ver as novas colunas:
  - ✅ `google_access_token`
  - ✅ `google_refresh_token`
  - ✅ `google_token_expires_at`
  - ✅ `google_connected_at`

---

## ✅ Pronto!

Agora você pode testar a conexão do Google Calendar!

### O que mudou:

✅ **Antes:** Token ficava no navegador (localStorage)
- ❌ Perdia ao fechar o navegador
- ❌ Precisava reconectar em cada dispositivo
- ❌ Não era persistente

✅ **Agora:** Token fica no banco de dados
- ✅ Conecta UMA vez e fica para sempre
- ✅ Funciona em qualquer dispositivo
- ✅ Cada cliente tem seu próprio token
- ✅ Eventos são criados no calendário do próprio cliente

---

## 🎯 Próximos passos:

1. ✅ Execute o SQL acima no Supabase
2. ✅ Aguarde o deploy do Vercel (2-3 minutos)
3. ✅ Vá para: https://app.cleanbiz360.com/agenda
4. ✅ Clique em "Conectar Google Calendar"
5. ✅ Faça login com sua conta Google
6. ✅ Autorize o acesso
7. ✅ Pronto! Você estará conectado permanentemente

---

## 📞 Dúvidas?

Se algo der errado, me avise e eu te ajudo! 😊

