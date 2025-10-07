# 🎰 Afiliados Brasil - Bravo.Bet

Sistema completo de captação e gerenciamento de leads para o programa de afiliados da Bravo.Bet.

## 📋 Índice

- [Sobre o Projeto](#sobre-o-projeto)
- [Tecnologias](#tecnologias)
- [Configuração](#configuração)
- [Estrutura do Banco de Dados](#estrutura-do-banco-de-dados)
- [Como Usar](#como-usar)
- [Documentação](#documentação)

## 🎯 Sobre o Projeto

Sistema web para captação de leads interessados em se tornar afiliados da Bravo.Bet no mercado de iGaming brasileiro. O sistema inclui:

- ✅ Landing page moderna e responsiva
- ✅ Formulário inteligente com múltiplas etapas
- ✅ Dashboard administrativo completo
- ✅ Rastreamento de visualizações
- ✅ Sistema de localização por IP
- ✅ Integração com Facebook Pixel e Google Analytics
- ✅ Gestão de leads com status de contato

## 🚀 Tecnologias

### Frontend
- **React** 18+ - Framework JavaScript
- **React Router** - Navegação entre páginas
- **Framer Motion** - Animações fluidas
- **Tailwind CSS** - Estilização moderna
- **Heroicons** - Ícones SVG

### Backend
- **Supabase** - Backend as a Service
- **PostgreSQL** - Banco de dados relacional
- **Row Level Security (RLS)** - Segurança avançada

### Integrações
- **Facebook Pixel** - Rastreamento de conversões
- **Google Analytics** - Análise de tráfego
- **IP Geolocation** - Localização dos usuários

## ⚙️ Configuração

### 1. Clone o Repositório

```bash
git clone https://github.com/seu-usuario/afiliadosbrasil.git
cd afiliadosbrasil
```

### 2. Instale as Dependências

```bash
npm install
```

### 3. Configure as Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
REACT_APP_SUPABASE_URL=https://fycxzrsxddwzpeprgyxt.supabase.co
REACT_APP_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ5Y3h6cnN4ZGR3enBlcHJneXh0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk4NTI1NjEsImV4cCI6MjA3NTQyODU2MX0.92gpCksqOQYVN2kG4oXFURVkanPzYvkrHotzOHDfJk8
```

📖 **Detalhes**: Veja `CONFIGURACAO_ENV.md`

### 4. Configure o Banco de Dados

1. Acesse [Supabase Dashboard](https://app.supabase.com)
2. Abra o **SQL Editor**
3. Execute o conteúdo completo do arquivo `database.sql`

📖 **Detalhes**: Veja `SETUP_DATABASE.md`

### 5. Inicie o Servidor de Desenvolvimento

```bash
npm start
```

O projeto estará disponível em `http://localhost:3000`

## 📁 Estrutura do Projeto

```
afiliadosbrasil/
├── public/                      # Arquivos estáticos
│   ├── index.html              # HTML principal
│   ├── logo.png                # Logo Bravo.Bet
│   ├── bravo-logo.png          # Logo alternativa
│   ├── fundo.png               # Background
│   └── vsl.mp4                 # Vídeo (se houver)
│
├── src/
│   ├── api/                    # Chamadas à API
│   │   ├── formApi.js          # CRUD de submissions
│   │   └── supabase.js         # Cliente Supabase
│   │
│   ├── components/             # Componentes React
│   │   ├── AffiliateForm.js    # Formulário de cadastro
│   │   ├── FacebookPixel.js    # Integração Facebook
│   │   ├── GoogleAnalytics.js  # Integração GA
│   │   ├── HeatMap.js          # Mapa de calor
│   │   └── PrivateRoute.js     # Rota protegida
│   │
│   ├── pages/                  # Páginas principais
│   │   ├── HomePage.js         # Landing page
│   │   ├── Dashboard.js        # Painel administrativo
│   │   └── Login.js            # Tela de login
│   │
│   ├── services/               # Serviços externos
│   │   ├── ipService.js        # Geolocalização por IP
│   │   └── pageViewService.js  # Rastreamento de visitas
│   │
│   ├── contexts/               # Context API
│   │   └── AuthContext.js      # Contexto de autenticação
│   │
│   ├── lib/                    # Bibliotecas
│   │   └── supabase.js         # Cliente Supabase
│   │
│   ├── router/                 # Configuração de rotas
│   │   └── config.js           # Rotas da aplicação
│   │
│   ├── App.js                  # Componente principal
│   ├── index.js                # Entry point
│   └── index.css               # Estilos globais
│
├── database.sql                # Script SQL completo
├── SETUP_DATABASE.md           # Guia de setup do banco
├── MIGRACAO.md                 # Guia de migração
├── CONFIGURACAO_ENV.md         # Guia de configuração
├── README_COMPLETO.md          # Este arquivo
├── package.json                # Dependências npm
├── tailwind.config.js          # Configuração Tailwind
└── netlify.toml                # Deploy Netlify
```

## 🗄️ Estrutura do Banco de Dados

### Tabelas Principais

#### `submissions`
Armazena os leads capturados:
- Dados pessoais (nome, telefone, email, CPF)
- Informações profissionais (experiência, faturamento, fonte de tráfego)
- Dados de rastreamento (IP, data de submissão)
- Status de contato

#### `page_views`
Registra visualizações da landing page:
- IP do visitante
- Localização (cidade, região, país)
- Data e hora da visita
- User agent

### Views Disponíveis

- `vw_submission_stats` - Estatísticas gerais de leads
- `vw_submissions_por_dia` - Leads agrupados por dia
- `vw_page_view_stats` - Estatísticas de visualizações
- `vw_views_por_dia` - Visualizações por dia
- `vw_top_locations` - Top 10 localizações

### Funções Úteis

- `get_conversion_rate()` - Calcula taxa de conversão
- `cleanup_old_page_views()` - Remove dados antigos

📖 **Detalhes**: Veja `SETUP_DATABASE.md`

## 🎨 Funcionalidades

### Landing Page
- Design moderno e responsivo
- Formulário em múltiplas etapas
- Validação de CPF em tempo real
- Animações suaves com Framer Motion
- Rastreamento automático de visualizações
- Integração com Facebook Pixel e Google Analytics

### Dashboard Administrativo
- Listagem completa de leads
- Filtros avançados (nome, telefone, IP, data, experiência)
- Busca em tempo real
- Estatísticas de conversão
- Marcação de status de contato
- Visualização de localização por IP
- Link direto para WhatsApp
- Modal com detalhes de visualizações
- Exclusão de leads com confirmação

### Sistema de Segurança
- Autenticação via Supabase Auth
- Row Level Security (RLS)
- Rotas protegidas
- Políticas de acesso granulares

## 📱 Como Usar

### Para Visitantes

1. Acesse a landing page
2. Preencha o formulário em 7 etapas:
   - Experiência com iGaming
   - Faturamento mensal
   - Fonte de tráfego
   - Nome
   - CPF
   - Email
   - Telefone
3. Receba confirmação de cadastro
4. Entre em contato via WhatsApp

### Para Administradores

1. Acesse `/login`
2. Faça login com credenciais Supabase
3. Visualize e gerencie leads no dashboard
4. Use filtros para segmentar leads
5. Marque leads como "Contactados"
6. Exporte dados conforme necessário

## 🔐 Autenticação

### Criar Usuário Administrador

No Supabase Dashboard:

1. Vá em **Authentication** > **Users**
2. Clique em **Add user**
3. Escolha **Create new user**
4. Preencha email e senha
5. Clique em **Create user**

Agora você pode fazer login com essas credenciais em `/login`

## 📊 Consultas Úteis

### Ver todos os leads
```sql
SELECT * FROM submissions ORDER BY submitted_at DESC;
```

### Leads não contactados
```sql
SELECT * FROM submissions WHERE contacted = false;
```

### Taxa de conversão
```sql
SELECT get_conversion_rate();
```

### Estatísticas gerais
```sql
SELECT * FROM vw_submission_stats;
```

### Top localizações
```sql
SELECT * FROM vw_top_locations;
```

## 🚀 Deploy

### Netlify

O projeto está configurado para deploy no Netlify via `netlify.toml`:

```bash
# Build para produção
npm run build

# O Netlify fará o deploy automaticamente ao fazer push para main/master
```

### Variáveis de Ambiente no Netlify

Configure no Netlify Dashboard:
1. Site Settings > Build & Deploy > Environment
2. Adicione:
   - `REACT_APP_SUPABASE_URL`
   - `REACT_APP_SUPABASE_ANON_KEY`

## 📚 Documentação Adicional

- 📖 `CONFIGURACAO_ENV.md` - Como configurar variáveis de ambiente
- 📖 `SETUP_DATABASE.md` - Como configurar o banco de dados
- 📖 `MIGRACAO.md` - Como migrar do sistema antigo (com tickets)
- 📖 `database.sql` - Script SQL completo com comentários

## 🔄 Atualizações Recentes

### Versão 2.0 (Atual)

- ✅ Removido sistema de tickets e sorteio
- ✅ Foco em gestão de leads
- ✅ Banco de dados otimizado
- ✅ Views e funções para relatórios
- ✅ Melhor performance
- ✅ Código mais limpo e mantível

### Migração da v1.0

Se você estava usando a versão anterior com sistema de tickets, veja o guia completo em `MIGRACAO.md`.

## 🛠️ Manutenção

### Limpar dados antigos
```sql
SELECT cleanup_old_page_views();
```

### Backup do banco
No Supabase Dashboard:
- Database > Backups > Create backup

### Verificar saúde do sistema
```sql
-- Tamanho das tabelas
SELECT 
  tablename,
  pg_size_pretty(pg_total_relation_size('public.'||tablename)) AS size
FROM pg_tables 
WHERE schemaname = 'public';

-- Performance dos índices
SELECT * FROM pg_stat_user_indexes WHERE schemaname = 'public';
```

## 🐛 Solução de Problemas

### Formulário não envia
1. Verifique o console do navegador (F12)
2. Confirme que o `.env` está configurado
3. Teste a conexão com o Supabase

### Dashboard não lista leads
1. Verifique se está autenticado
2. Confirme que as políticas RLS estão ativas
3. Veja se há dados em `submissions`

### Visualizações não são registradas
1. Verifique se `page_views` existe
2. Confirme as permissões de inserção
3. Veja os logs no Supabase

## 📞 Suporte

Para problemas técnicos:
1. Verifique a documentação completa
2. Revise os logs do Supabase
3. Confira o console do navegador
4. Veja os exemplos em `database.sql`

## 📄 Licença

Este projeto foi desenvolvido para uso exclusivo da Bravo.Bet.

---

**Desenvolvido com ❤️ para Bravo.Bet**

**Projeto**: Afiliados Brasil  
**Versão**: 2.0  
**Última Atualização**: 2024  
**Status**: ✅ Em Produção

