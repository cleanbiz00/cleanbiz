# Como Testar no Localhost

## 1. Configurar Google Cloud Console

Adicione esta URL de redirecionamento no Google Cloud Console:

**Authorized redirect URIs:**
```
http://localhost:3000/api/google-calendar/auth
```

## 2. Variáveis de Ambiente

Certifique-se que você tem um arquivo `.env.local` com:

```env
NEXT_PUBLIC_GOOGLE_CLIENT_ID=seu_client_id
GOOGLE_CLIENT_SECRET=seu_client_secret
NEXT_PUBLIC_SUPABASE_URL=sua_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_key
SUPABASE_SERVICE_ROLE_KEY=sua_service_key
```

## 3. Conectar Google Calendar

1. Acesse: `http://localhost:3000/agenda`
2. Clique em "Conectar" no status das integrações
3. Autorize no Google
4. O token será salvo automaticamente

## 4. Testar Comentários

1. Clique em "+Novo"
2. Preencha todos os campos
3. No campo "Comentários", digite algo
4. Salve o agendamento
5. Verifique no Google Calendar se o comentário aparece

