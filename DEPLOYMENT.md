# Deployment Medway Fichas no Vercel

## Pré-requisitos
- Conta no GitHub
- Conta no Vercel (crie em vercel.com)

## Passo 1: Criar repositório no GitHub

### Opção A: Via GitHub Web (Recomendado)
1. Acesse https://github.com/new
2. Nome do repositório: `medway-fichas`
3. Descrição: "Plataforma de geração de fichas de educação médica com Medway Design System"
4. Escolha: Public (para fácil acesso)
5. Clique em "Create repository"

### Opção B: Via GitHub CLI
```bash
gh repo create medway-fichas --public --source=. --remote=origin --push
```

## Passo 2: Push do código para GitHub

### Se criou repo manualmente:
```bash
cd C:\Users\Usuário\medway-fichas

# Adicionar remote
git remote add origin https://github.com/seu-usuario/medway-fichas.git

# Renomear branch (se necessário)
git branch -M main

# Push
git push -u origin main
```

### Se usou GitHub CLI:
```bash
# O código já foi pushado automaticamente!
```

## Passo 3: Deploy no Vercel

### Opção A: Via Vercel Web (Mais Fácil)
1. Acesse https://vercel.com/dashboard
2. Clique em "Add New..." → "Project"
3. Clique em "Import Git Repository"
4. Procure por "medway-fichas" e clique para importar
5. Vercel detectará automaticamente:
   - Framework: Next.js ✓
   - Build Command: `npm run build` ✓
   - Start Command: `npm run start` ✓

6. Clique em "Deploy"

**Pronto! Seu site estará disponível em: `https://medway-fichas.vercel.app`**

### Opção B: Via Vercel CLI
```bash
npm install -g vercel

cd C:\Users\Usuário\medway-fichas

vercel

# Você será perguntado:
# - Set up and deploy? → Yes
# - Which scope? → Seu usuário
# - Link to existing project? → No (primeira vez)
# - Project name? → medway-fichas
# - In which directory? → ./
# - Auto-detect build settings? → Yes
# - Do you want to override the settings? → No
```

## Passo 4: Verificar Deploy

Após deploy:
- ✅ URL da aplicação: vercel.com/dashboard → seu projeto
- ✅ Status: "Ready" (verde)
- ✅ Testar em: https://medway-fichas.vercel.app

## Redeploy Automático

Sempre que você fizer `git push origin main`:
1. GitHub avisa Vercel
2. Vercel faz rebuild automático
3. Site atualizado em segundos

**Não precisa fazer nada manualmente! 🚀**

## Troubleshooting

### Build falha?
- Verifique: `npm run build` funciona localmente
- Se erro de tipo: `npm run lint` para debugging

### Site lento?
- Vercel fornece analytics grátis em dashboard
- Pode otimizar com caching, edge functions, etc.

### Variáveis de ambiente (para o futuro)
Se precisar de `.env` no Vercel:
1. Dashboard → Settings → Environment Variables
2. Adicione suas variáveis
3. Redeploy

## URLs Úteis

- Dashboard Vercel: https://vercel.com/dashboard
- Seu projeto: https://vercel.com/seu-usuario/medway-fichas
- Docs Vercel + Next.js: https://vercel.com/docs/nextjs

---

**Dúvidas? Verifique logs:**
- Vercel: Dashboard → seu projeto → Deployments → clique no deployment → Logs
- Local: `npm run dev` e abra http://localhost:3000
