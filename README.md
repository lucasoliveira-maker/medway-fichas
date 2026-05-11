# 📚 Medway Fichas - Gerador de Fichas de Educação Médica

Plataforma web automatizada para gerar fichas de educação médica seguindo **100% do Medway Design System v1.0**.

## 🎯 O que é?

Uma aplicação web moderna que permite criar, editar e exportar fichas médicas com:
- ✅ Design System Medway integrado (cores, tipografia, componentes)
- ✅ Editor dinâmico com 7 tipos de seção
- ✅ Preview em tempo real
- ✅ Validação automática Medway
- ✅ Exportação PDF (jsPDF + html2canvas)
- ✅ Dashboard com gerenciamento de fichas
- ✅ Persistência com localStorage (offline-first)

## 🚀 Deploy Rápido

### ☁️ Vercel (Recomendado)
```bash
# 1. Criar repo GitHub
# 2. Push: git push origin main
# 3. Ir em vercel.com/dashboard → Import → medway-fichas
# ✓ Deploy automático!
```

Ver instruções completas em [DEPLOYMENT.md](./DEPLOYMENT.md)

## 💻 Desenvolvimento Local

### Setup
```bash
# Clone ou abra o diretório
cd C:\Users\Usuário\medway-fichas

# Instale dependências (se precisar)
npm install

# Inicie servidor
npm run dev
```

### Acesse
- 🌐 http://localhost:3000 → Dashboard
- ✏️ http://localhost:3000/editor → Editor

## 📋 Estrutura do Projeto

```
src/
├── app/                        # Páginas Next.js
│   ├── page.tsx               # Dashboard
│   ├── editor/page.tsx        # Editor de fichas
│   └── globals.css            # Estilos globais
│
├── components/
│   ├── Medway/                # Componentes Design System
│   │   ├── Heading.tsx        # H1, H2, H3
│   │   ├── CalloutBox.tsx     # Caixas info/aviso
│   │   ├── TableMedway.tsx    # Tabelas
│   │   ├── ListBullets.tsx    # Listas
│   │   ├── ImageCaption.tsx   # Imagens
│   │   └── FichaRenderer.tsx  # Renderizador completo
│   └── Editor/
│       └── FormularioFicha.tsx # Formulário dinâmico
│
├── hooks/
│   ├── useFicha.ts            # Gerenciamento ficha
│   └── useLocalStorage.ts     # Persistência
│
├── services/
│   ├── validadorMedway.ts     # Validação automática
│   └── exportadorPDF.ts       # Exportação PDF
│
├── types/
│   └── ficha.types.ts         # Interfaces TypeScript
│
├── styles/
│   └── medway-design.css      # CSS Variables Medway
│
└── utils/
    └── medway-colors.ts       # Paleta de cores
```

## 🎨 Paleta Medway

| Cor | Valor | Uso |
|-----|-------|-----|
| 🔵 Teal Primário | #01CFAB | Ações, highlights |
| 🔷 Navy Escuro | #00205B | Títulos principais |
| 🔹 Blue Secundário | #1862BC | Títulos secundários |
| ⚪ Light Gray | #F5F7FA | Backgrounds |
| ✅ Success | #28A745 | Validação OK |
| ❌ Error | #DC3545 | Erros |

## 📝 Como Usar

### 1. Criar Nova Ficha
- Clique em "➕ Criar Nova Ficha"
- Preencha título e subtítulo
- Adicione seções (H2, H3, parágrafos, listas, etc)

### 2. Preview em Tempo Real
- Alterações aparecem instantaneamente
- Layout desktop: 2 colunas
- Layout mobile: abas

### 3. Validação Medway
- Checklist automático abaixo do formulário
- Erros: pontos críticos que precisam correção
- Avisos: melhorias recomendadas

### 4. Exportar
- Clique em "📄 PDF"
- Arquivo será baixado automaticamente

### 5. Salvar Ficha
- Clique em "💾 Salvar"
- Fica armazenada em localStorage
- Voltará quando reabrir browser

## 🔧 Tipos de Seção

| Tipo | Para usar quando... |
|------|---------------------|
| **H2** | Seção principal |
| **H3** | Subseção |
| **Parágrafo** | Texto corrido |
| **Lista** | Pontos numerados |
| **Tabela** | Dados estruturados |
| **Imagem** | Fotos/diagrams |
| **Callout** | Destaque info/aviso |

## 📦 Dependências Principais

- **Next.js 14** - Framework React/SSR
- **React 18** - UI components
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **jsPDF + html2canvas** - PDF export
- **zustand** - State management
- **react-hook-form** - Forms

## 🧪 Build & Testes

```bash
# Build para produção
npm run build

# Verifica tipos TypeScript
npm run type-check

# Lint (ESLint)
npm run lint
```

## 🚀 Roadmap Futuro

- [ ] Autenticação de usuários
- [ ] Backend com PostgreSQL
- [ ] Histórico de versões
- [ ] Compartilhamento de fichas (links)
- [ ] Exportação DOCX editável
- [ ] Temas customizáveis
- [ ] Colaboração em tempo real

## 📞 Suporte

- 📖 Docs: Veja `DEPLOYMENT.md`
- 🐛 Bug? Abra issue no GitHub
- 💡 Feature request? Coloque uma issue

## 📄 Licença

MIT - Sinta-se livre para usar em projetos pessoais e comerciais

---

**Feito com ❤️ e Medway Design System**

Versão: 1.0.0 MVP
Última atualização: Maio 2026
