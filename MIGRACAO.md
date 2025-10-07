# 🔄 Guia de Migração - Remoção do Sistema de Tickets

Este guia explica como migrar do sistema antigo (com tickets e sorteio) para o novo sistema (apenas leads).

## ⚠️ Importante - Backup

**ANTES DE FAZER QUALQUER ALTERAÇÃO, FAÇA BACKUP DOS SEUS DADOS!**

### Fazer Backup no Supabase:

1. Acesse o Supabase Dashboard
2. Vá em **Database** > **Backups**
3. Clique em **Create backup** para criar um backup manual
4. OU exporte os dados manualmente:

```sql
-- Exportar submissions
COPY submissions TO '/tmp/submissions_backup.csv' DELIMITER ',' CSV HEADER;

-- Exportar tickets (se existir)
COPY tickets TO '/tmp/tickets_backup.csv' DELIMITER ',' CSV HEADER;

-- Exportar page_views
COPY page_views TO '/tmp/page_views_backup.csv' DELIMITER ',' CSV HEADER;
```

## 📋 O Que Foi Removido

### Componentes Removidos:
- ❌ `src/components/TicketManager.js` - Componente de gerenciamento de tickets e sorteio

### Funcionalidades Removidas:
- ❌ Geração de tickets
- ❌ Validação de tickets
- ❌ Sistema de sorteio
- ❌ Aba de "Tickets" no Dashboard
- ❌ Exibição do número do ticket após cadastro

### Tabelas Removidas do Banco:
- ❌ `tickets` - Tabela que armazenava os tickets gerados

## 🔧 Passos para Migração

### 1. Atualizar o Código

Os arquivos já foram atualizados automaticamente. Certifique-se de ter as versões mais recentes:

```bash
git pull origin master
npm install
```

### 2. Migrar Dados Existentes (Opcional)

Se você tinha dados na tabela `tickets` e quer preservar o histórico de cadastros:

```sql
-- Verificar se há dados na tabela tickets que não estão em submissions
SELECT t.* 
FROM tickets t
LEFT JOIN submissions s ON t.cpf = s.cpf
WHERE s.id IS NULL;

-- Se houver registros únicos, você pode migrá-los para submissions:
-- (Ajuste os valores conforme necessário)
INSERT INTO submissions (
  nome, 
  telefone, 
  cpf, 
  email, 
  experiencia_igaming,
  faturamento_mensal,
  fonte_trafego,
  submitted_at
)
SELECT 
  nome,
  telefone,
  cpf,
  email,
  'NÃO SEI O QUE É', -- valor padrão para experiência
  'Não informado', -- valor padrão para faturamento
  'Não informado', -- valor padrão para fonte
  created_at
FROM tickets t
WHERE NOT EXISTS (
  SELECT 1 FROM submissions s WHERE s.cpf = t.cpf
);
```

### 3. Remover Tabela de Tickets

⚠️ **ATENÇÃO**: Esta ação é irreversível! Certifique-se de ter feito backup.

```sql
-- Remover a tabela tickets (se existir)
DROP TABLE IF EXISTS tickets CASCADE;
```

### 4. Executar o Novo Script de Banco de Dados

Execute o arquivo `database.sql` completo:

1. Acesse o SQL Editor no Supabase
2. Abra o arquivo `database.sql`
3. Copie todo o conteúdo
4. Cole e execute no SQL Editor

Isso irá:
- ✅ Criar/atualizar a estrutura das tabelas existentes
- ✅ Adicionar novos índices e constraints
- ✅ Criar políticas de segurança atualizadas
- ✅ Criar views e funções úteis

### 5. Limpar Código Antigo (Se necessário)

Se você fez personalizações, verifique se não há referências antigas:

```bash
# Buscar referências a "ticket" no código
grep -r "ticket" src/

# Buscar importações do TicketManager
grep -r "TicketManager" src/
```

### 6. Testar o Sistema

Após a migração:

1. **Teste o Formulário:**
   - [ ] Acesse a landing page
   - [ ] Preencha o formulário
   - [ ] Verifique se o cadastro foi salvo em `submissions`
   - [ ] Confirme que aparece a mensagem de sucesso (sem número de ticket)

2. **Teste o Dashboard:**
   - [ ] Faça login
   - [ ] Verifique se os leads aparecem
   - [ ] Teste os filtros
   - [ ] Teste marcar como "Contactado"
   - [ ] Confirme que não há mais aba de "Tickets"

3. **Teste Visualizações:**
   - [ ] Acesse a landing page em modo anônimo
   - [ ] Verifique se a visualização foi registrada
   - [ ] Confira no Dashboard se o contador aumentou

## 🆕 Novas Funcionalidades

Após a migração, você terá acesso a:

### Views de Relatórios:
```sql
-- Estatísticas gerais
SELECT * FROM vw_submission_stats;

-- Submissões por dia
SELECT * FROM vw_submissions_por_dia;

-- Visualizações por dia
SELECT * FROM vw_views_por_dia;

-- Top localizações
SELECT * FROM vw_top_locations;
```

### Função de Taxa de Conversão:
```sql
-- Ver taxa de conversão em %
SELECT get_conversion_rate();
```

### Manutenção Automatizada:
```sql
-- Limpar visualizações antigas (>90 dias)
SELECT cleanup_old_page_views();
```

## 🔄 Comparativo: Antes vs Depois

### Fluxo Antigo:
1. Usuário preenche formulário
2. Sistema gera número de ticket aleatório
3. Ticket salvo em tabela `tickets`
4. Usuário precisa validar ticket no estande
5. Administrador sorteia entre tickets validados

### Fluxo Novo:
1. Usuário preenche formulário
2. Dados salvos diretamente em `submissions`
3. Mensagem de sucesso com link para WhatsApp
4. Administrador gerencia leads direto no dashboard
5. Foco em conversão e acompanhamento de leads

## 📊 Estrutura Simplificada

### Antes:
```
Formulário → Submissions + Tickets → Validação → Sorteio
```

### Agora:
```
Formulário → Submissions → Gestão de Leads → Conversão
```

## 🎯 Benefícios da Nova Estrutura

✅ **Simplicidade**: Menos tabelas, menos complexidade

✅ **Performance**: Queries mais rápidas, menos joins

✅ **Foco**: Concentração em captura e conversão de leads

✅ **Manutenção**: Código mais limpo e fácil de manter

✅ **Segurança**: Políticas RLS bem definidas

✅ **Relatórios**: Views prontas para análise

## ⚠️ Problemas Comuns e Soluções

### Erro: "relation 'tickets' does not exist"
**Solução**: Normal! A tabela foi removida. Certifique-se de que não há código tentando acessá-la.

### Erro: "Cannot read property 'ticket_number'"
**Solução**: Limpe o cache do navegador e recarregue a aplicação.

### Erro: "Function generateTicket is not defined"
**Solução**: Atualize o código para a versão mais recente sem as funções de ticket.

### Dashboard mostra erro 404 em TicketManager
**Solução**: Limpe o cache do build:
```bash
rm -rf build/
npm run build
```

## 📞 Suporte

Se encontrar problemas durante a migração:

1. Verifique os logs do console (F12 no navegador)
2. Confira os logs do Supabase (Dashboard > Logs)
3. Restaure o backup se necessário
4. Revise este guia passo a passo

## ✅ Checklist de Migração Completa

- [ ] Backup realizado
- [ ] Código atualizado
- [ ] Dados migrados (se necessário)
- [ ] Tabela `tickets` removida
- [ ] Script `database.sql` executado
- [ ] Formulário testado
- [ ] Dashboard testado
- [ ] Visualizações testadas
- [ ] Cache limpo
- [ ] Build gerado
- [ ] Deploy realizado
- [ ] Testes em produção

---

**Data da Migração**: _______________________

**Responsável**: _______________________

**Observações**: _______________________

---

💡 **Dica**: Mantenha este documento e os backups por pelo menos 30 dias após a migração.

