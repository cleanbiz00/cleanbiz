# Variáveis de Ambiente Necessárias

## Configuração para app.cleanbiz360.com

### Variáveis Obrigatórias

```bash
# Base URL do aplicativo
NEXT_PUBLIC_BASE_URL=https://app.cleanbiz360.com

# Supabase
NEXT_PUBLIC_SUPABASE_URL=sua_url_do_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase

# Google Calendar OAuth
NEXT_PUBLIC_GOOGLE_CLIENT_ID=seu_client_id_do_google
GOOGLE_CLIENT_SECRET=seu_client_secret_do_google

# SendGrid Email
SENDGRID_API_KEY=sua_api_key_do_sendgrid
SENDGRID_FROM_EMAIL=noreply@cleanbiz360.com
```

### URLs de Redirecionamento Autorizadas no Google Console

Adicione estas URLs no Google Cloud Console > Credentials > OAuth 2.0 Client IDs:

```
https://app.cleanbiz360.com/api/google-calendar/auth
http://localhost:3000/api/google-calendar/auth
```

### URLs Atuais no Console (para remover depois da migração)

```
https://cleanbiz00.vercel.app/api/google-calendar/auth
https://cleanbiz360.com/api/google-calendar/auth
https://www.cleanbiz360.com/api/google-calendar/auth
```

### Verificação

Para verificar se todas as variáveis estão configuradas corretamente, acesse:
`https://app.cleanbiz360.com/api/check-config`

A resposta deve mostrar:
```json
{
  "success": true,
  "config": {
    "googleCalendar": true,
    "email": true,
    "supabase": true
  }
}
```
