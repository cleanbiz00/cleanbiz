# CleanBiz360 - Página de Vendas

Página de vendas independente para o CleanBiz360, otimizada para deploy em subdomínio.

## 🚀 Deploy Rápido

### Opção 1: Vercel (Recomendado)

1. **Conectar ao Vercel:**
   ```bash
   npm install -g vercel
   vercel login
   cd vendas-deploy
   vercel
   ```

2. **Configurar Domínio:**
   - No painel Vercel: Settings → Domains
   - Adicionar: `vendas.cleanbiz360.com`
   - Configurar DNS no seu provedor

### Opção 2: Netlify

1. **Deploy via Git:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin [seu-repo]
   git push -u origin main
   ```

2. **Conectar no Netlify:**
   - Importar projeto do GitHub
   - Build command: `npm run build`
   - Publish directory: `out`

### Opção 3: GitHub Pages

1. **Build estático:**
   ```bash
   npm run build
   npm run export
   ```

2. **Deploy para GitHub Pages:**
   ```bash
   npm install -g gh-pages
   gh-pages -d out
   ```

## 📁 Estrutura

```
vendas-deploy/
├── src/
│   └── app/
│       ├── page.tsx          # Página principal de vendas
│       ├── layout.tsx        # Layout base
│       └── globals.css       # Estilos globais
├── package.json              # Dependências
├── next.config.mjs          # Config Next.js
├── tailwind.config.js       # Config Tailwind
└── README.md                # Este arquivo
```

## 🎯 Características

- ✅ **Deploy independente** - Não afeta o app principal
- ✅ **Otimizado para SEO** - Meta tags completas
- ✅ **Responsivo** - Funciona em todos os dispositivos
- ✅ **Performance** - Build estático otimizado
- ✅ **Subdomínio próprio** - `vendas.cleanbiz360.com`

## 🔧 Configurações

### Variáveis de Ambiente (Opcional)
```bash
# .env.local
NEXT_PUBLIC_APP_URL=https://app.cleanbiz360.com
NEXT_PUBLIC_CONTACT_EMAIL=contato@cleanbiz360.com
```

### DNS Configuration
```
# Adicionar no seu provedor DNS:
vendas.cleanbiz360.com → CNAME → [deploy-url]
```

## 🚀 Comandos

```bash
# Instalar dependências
npm install

# Desenvolvimento local
npm run dev

# Build para produção
npm run build

# Preview da build
npm run start
```

## 📊 Analytics (Opcional)

Para adicionar Google Analytics:

1. Adicionar no `layout.tsx`:
```tsx
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
```

2. Configurar no `page.tsx`:
```tsx
useEffect(() => {
  gtag('config', 'GA_MEASUREMENT_ID')
}, [])
```

## 🎨 Personalização

- **Cores**: Editar `tailwind.config.js`
- **Conteúdo**: Editar `src/app/page.tsx`
- **Estilos**: Editar `src/app/globals.css`

## 📞 Suporte

Para dúvidas sobre deploy ou configuração, consulte a documentação da plataforma escolhida ou entre em contato.
