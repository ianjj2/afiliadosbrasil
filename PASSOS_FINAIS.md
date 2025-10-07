# 🎯 Passos Finais para Corrigir o Sistema

## ✅ Já Feito
- ✅ Arquivo `.env` criado com as credenciais corretas
- ✅ CPF removido do formulário
- ✅ Código atualizado

## 🚀 Execute Agora (EM ORDEM!)

### Passo 1: Executar SQL no Supabase

1. Acesse: https://app.supabase.com
2. Selecione o projeto: **fycxzrsxddwzpeprgyxt**
3. Vá em **SQL Editor** (menu lateral)
4. Copie e execute este script:

```sql
-- 1. Tornar CPF opcional
ALTER TABLE submissions ALTER COLUMN cpf DROP NOT NULL;

-- 2. Remover constraint antiga
ALTER TABLE submissions DROP CONSTRAINT IF EXISTS chk_cpf_format;

-- 3. Adicionar nova constraint
ALTER TABLE submissions ADD CONSTRAINT chk_cpf_format 
CHECK (cpf IS NULL OR cpf ~ '^[0-9]{11}$');

-- 4. Verificar
SELECT 'Banco atualizado com sucesso!' as status;
```

### Passo 2: Verificar Políticas RLS

No Supabase, vá em **Database** > **Policies** e verifique se estas políticas existem:

**Para tabela `submissions`:**
- ✅ `Qualquer um pode inserir submissions` (INSERT para anon)
- ✅ `Usuários autenticados podem ler submissions` (SELECT para authenticated)

**Para tabela `page_views`:**
- ✅ `Qualquer um pode inserir page_views` (INSERT para anon)
- ✅ `Usuários autenticados podem ler page_views` (SELECT para authenticated)

**Se não existirem**, execute no SQL Editor:

```sql
-- Habilitar RLS
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;

-- Políticas para submissions
DROP POLICY IF EXISTS "Qualquer um pode inserir submissions" ON submissions;
CREATE POLICY "Qualquer um pode inserir submissions"
    ON submissions FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

DROP POLICY IF EXISTS "Usuários autenticados podem ler submissions" ON submissions;
CREATE POLICY "Usuários autenticados podem ler submissions"
    ON submissions FOR SELECT
    TO authenticated
    USING (true);

-- Políticas para page_views
DROP POLICY IF EXISTS "Qualquer um pode inserir page_views" ON page_views;
CREATE POLICY "Qualquer um pode inserir page_views"
    ON page_views FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

DROP POLICY IF EXISTS "Usuários autenticados podem ler page_views" ON page_views;
CREATE POLICY "Usuários autenticados podem ler page_views"
    ON page_views FOR SELECT
    TO authenticated
    USING (true);
```

### Passo 3: Limpar Cache e Reiniciar

No PowerShell (na pasta do projeto):

```powershell
# Parar o servidor se estiver rodando (Ctrl+C)

# Limpar cache e node_modules
Remove-Item -Recurse -Force node_modules, build -ErrorAction SilentlyContinue

# Reinstalar dependências
npm install

# Iniciar servidor
npm start
```

### Passo 4: Testar

1. **Abrir o navegador**: http://localhost:3000
2. **Abrir Console** (F12)
3. **Preencher formulário** (6 etapas, sem CPF)
4. **Verificar no console**:
   - ✅ Não deve ter erro 401
   - ✅ Pode ter aviso de localização (normal)
   - ✅ Deve mostrar sucesso ao enviar

5. **Verificar no Supabase**:
   - Database > Table Editor > submissions
   - Deve aparecer o novo registro

## ⚠️ Erros que Você Pode Ver (E São Normais)

### ✅ Normal (pode ignorar):
```
"Não foi possível obter localização, continuando sem ela"
```
**Motivo**: API de geolocalização bloqueada/lenta
**Ação**: Nenhuma, sistema funciona normalmente

### ❌ Erro que NÃO deve aparecer:
```
"401 Unauthorized"
```
**Se aparecer**: As políticas RLS não estão corretas. Execute o Passo 2 novamente.

## 🔍 Checklist Final

- [ ] SQL executado no Supabase (Passo 1)
- [ ] Políticas RLS verificadas (Passo 2)
- [ ] Cache limpo e servidor reiniciado (Passo 3)
- [ ] Formulário testado (Passo 4)
- [ ] Registro aparece no Supabase
- [ ] Sem erro 401 no console

## 🎯 Resultado Esperado

Após todos os passos:
- ✅ Formulário com 6 campos (sem CPF)
- ✅ Submissões salvando corretamente
- ✅ Visualizações sendo registradas
- ✅ Dashboard listando leads
- ✅ Sistema 100% funcional

## 📞 Se Ainda Tiver Problema

Tire um print do console (F12) mostrando os erros e verifique:

1. **Console do navegador**: Qual erro aparece?
2. **Supabase Logs**: Database > Logs > Qual erro?
3. **Arquivo .env**: Está na raiz do projeto com conteúdo correto?

---

**Status Atual**: ✅ .env criado | ⏳ Aguardando execução do SQL

