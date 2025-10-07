# 🗄️ Configuração do Banco de Dados - Supabase

Este guia explica como configurar todo o banco de dados do projeto **Afiliados Brasil** no Supabase.

## 📋 Pré-requisitos

- Conta no [Supabase](https://supabase.com)
- Projeto criado no Supabase

## 🚀 Passo a Passo

### 1. Acessar o SQL Editor

1. Acesse o [Supabase Dashboard](https://app.supabase.com)
2. Selecione seu projeto
3. No menu lateral, clique em **SQL Editor**

### 2. Executar o Script SQL

1. Clique em **New query** (Nova consulta)
2. Abra o arquivo `database.sql` deste repositório
3. Copie todo o conteúdo do arquivo
4. Cole no editor SQL do Supabase
5. Clique em **Run** (Executar) ou pressione `Ctrl + Enter`

### 3. Verificar a Instalação

Após executar o script, você deverá ver mensagens de sucesso como:

```
✅ Tabelas criadas com sucesso!
✅ Índices criados com sucesso!
✅ Políticas de segurança configuradas!
✅ Views e funções criadas!
✅ Sistema de banco de dados está pronto para uso!
```

## 📊 Estrutura do Banco de Dados

### Tabelas Criadas

#### 1. **submissions** (Submissões de Leads)
Armazena todos os dados dos afiliados que preencheram o formulário.

**Campos principais:**
- `id` - ID único (gerado automaticamente)
- `nome` - Nome completo
- `telefone` - Número de WhatsApp
- `email` - Email de contato
- `cpf` - CPF (apenas números)
- `experiencia_igaming` - Experiência com iGaming (SIM, NÃO, NÃO SEI O QUE É)
- `faturamento_mensal` - Faixa de faturamento
- `fonte_trafego` - Principal fonte de tráfego
- `ip_address` - IP da submissão
- `contacted` - Se já foi contatado (true/false)
- `contact_date` - Data do contato
- `submitted_at` - Data da submissão
- `created_at` - Data de criação
- `updated_at` - Data da última atualização

#### 2. **page_views** (Visualizações de Página)
Registra todas as visualizações da landing page.

**Campos principais:**
- `id` - ID único
- `ip_address` - IP do visitante
- `location` - Dados de localização (JSON: cidade, região, país)
- `timestamp` - Data e hora da visita
- `user_agent` - Informações do navegador

### Views (Visualizações)

#### 1. `vw_submission_stats`
Estatísticas gerais sobre as submissões:
```sql
SELECT * FROM vw_submission_stats;
```

Retorna:
- Total de submissões
- Total contactados
- Total pendentes
- Afiliados experientes
- Afiliados iniciantes
- Potenciais afiliados
- Dias com submissões
- Última submissão
- Primeira submissão

#### 2. `vw_submissions_por_dia`
Submissões agrupadas por dia:
```sql
SELECT * FROM vw_submissions_por_dia;
```

#### 3. `vw_page_view_stats`
Estatísticas de visualizações:
```sql
SELECT * FROM vw_page_view_stats;
```

#### 4. `vw_views_por_dia`
Visualizações agrupadas por dia:
```sql
SELECT * FROM vw_views_por_dia;
```

#### 5. `vw_top_locations`
Top 10 cidades com mais visualizações:
```sql
SELECT * FROM vw_top_locations;
```

### Funções Úteis

#### 1. `get_conversion_rate()`
Calcula a taxa de conversão (submissões/visualizações):
```sql
SELECT get_conversion_rate();
```

Retorna a taxa de conversão em percentual.

#### 2. `cleanup_old_page_views()`
Remove visualizações com mais de 90 dias:
```sql
SELECT cleanup_old_page_views();
```

## 🔒 Políticas de Segurança (RLS)

O sistema utiliza Row Level Security (RLS) para garantir a segurança dos dados:

### Tabela `submissions`:
- ✅ Usuários autenticados podem ler todos os dados
- ✅ Qualquer pessoa (anônimo) pode inserir (necessário para o formulário público)
- ✅ Usuários autenticados podem atualizar
- ✅ Usuários autenticados podem deletar

### Tabela `page_views`:
- ✅ Usuários autenticados podem ler
- ✅ Qualquer pessoa pode inserir (necessário para rastrear visitas)

## 🔍 Consultas Úteis

### Ver todos os leads
```sql
SELECT * FROM submissions ORDER BY submitted_at DESC;
```

### Ver leads não contactados
```sql
SELECT * FROM submissions WHERE contacted = false ORDER BY submitted_at DESC;
```

### Ver afiliados experientes
```sql
SELECT * FROM submissions WHERE experiencia_igaming = 'SIM' ORDER BY submitted_at DESC;
```

### Ver visualizações de hoje
```sql
SELECT * FROM page_views 
WHERE DATE(timestamp) = CURRENT_DATE 
ORDER BY timestamp DESC;
```

### Contar visitantes únicos por dia
```sql
SELECT 
  DATE(timestamp) as data,
  COUNT(DISTINCT ip_address) as visitantes_unicos
FROM page_views
GROUP BY DATE(timestamp)
ORDER BY data DESC;
```

## 📈 Índices para Performance

O banco de dados está otimizado com índices para:
- Buscas por telefone, email e CPF
- Filtros por data
- Filtros por status de contato
- Filtros por experiência
- Consultas de localização

## ⚙️ Configuração das Variáveis de Ambiente

No seu projeto React, configure as seguintes variáveis no arquivo `.env`:

```env
REACT_APP_SUPABASE_URL=sua_url_do_supabase
REACT_APP_SUPABASE_ANON_KEY=sua_chave_anonima
```

Você pode encontrar esses valores em:
1. Acesse o Supabase Dashboard
2. Vá em **Settings** > **API**
3. Copie a **URL** e a **anon/public key**

## 🛠️ Manutenção

### Limpar dados antigos
Execute periodicamente para manter o banco otimizado:
```sql
SELECT cleanup_old_page_views();
```

### Verificar tamanho das tabelas
```sql
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

## ✅ Checklist de Configuração

- [ ] Projeto criado no Supabase
- [ ] Script `database.sql` executado com sucesso
- [ ] Todas as tabelas criadas (submissions, page_views)
- [ ] Políticas de segurança (RLS) habilitadas
- [ ] Views criadas e funcionando
- [ ] Variáveis de ambiente configuradas no projeto React
- [ ] Teste de inserção de dados (submeter formulário)
- [ ] Teste de visualização no dashboard

## 🆘 Suporte

Se encontrar problemas:

1. Verifique se todas as mensagens de sucesso apareceram após executar o script
2. Confirme que as variáveis de ambiente estão corretas
3. Verifique os logs no console do navegador
4. Acesse o Supabase Dashboard > **Database** > **Tables** para ver se as tabelas foram criadas

## 📝 Notas Importantes

- ⚠️ **Sistema de Tickets Removido**: Este projeto não utiliza mais o sistema de tickets e sorteio. Apenas formulário de leads.
- 🔄 O campo `updated_at` é atualizado automaticamente via trigger
- 🔐 As senhas de usuários são gerenciadas pelo Supabase Auth (não armazenadas nas tabelas)
- 🌍 As localizações são armazenadas em formato JSONB para flexibilidade
- 📊 As views são atualizadas automaticamente conforme novos dados são inseridos

## 🎯 Resultado Esperado

Após a configuração completa, você terá:

1. ✅ Sistema de captura de leads funcionando
2. ✅ Rastreamento de visualizações da página
3. ✅ Dashboard administrativo para gerenciar leads
4. ✅ Estatísticas e relatórios em tempo real
5. ✅ Sistema de segurança robusto com RLS
6. ✅ Performance otimizada com índices

---

**Desenvolvido para o projeto Afiliados Brasil - Bravo.Bet** 🎰

