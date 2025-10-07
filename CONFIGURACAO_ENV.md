# ⚙️ Configuração das Variáveis de Ambiente

## 📝 Criar arquivo `.env`

Crie um arquivo chamado `.env` na raiz do projeto (pasta `afiliadosbrasil`) com o seguinte conteúdo:

```env
# Configurações do Supabase
REACT_APP_SUPABASE_URL=https://fycxzrsxddwzpeprgyxt.supabase.co
REACT_APP_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ5Y3h6cnN4ZGR3enBlcHJneXh0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk4NTI1NjEsImV4cCI6MjA3NTQyODU2MX0.92gpCksqOQYVN2kG4oXFURVkanPzYvkrHotzOHDfJk8
```

## ⚠️ IMPORTANTE

### ⚠️ Nota sobre os Prefixos
- ✅ **React**: Use `REACT_APP_` como prefixo (este projeto)
- ❌ **Next.js**: `NEXT_PUBLIC_` (NÃO é este caso)

Suas credenciais vieram com prefixo `NEXT_PUBLIC_`, mas como este é um projeto **Create React App**, o correto é `REACT_APP_`.

## 🔒 Segurança

O arquivo `.env` já está no `.gitignore` e **NÃO** será enviado para o repositório Git. Isso é importante para manter suas credenciais seguras.

## 📁 Estrutura de Arquivos

Após criar o arquivo `.env`, sua estrutura deve ficar assim:

```
afiliadosbrasil/
├── .env                          ← Criar este arquivo
├── .gitignore
├── database.sql
├── CONFIGURACAO_ENV.md          ← Este arquivo
├── SETUP_DATABASE.md
├── MIGRACAO.md
├── package.json
├── public/
├── src/
└── ...
```

## ✅ Como Criar o Arquivo

### Windows (PowerShell):
```powershell
# Na pasta raiz do projeto
New-Item -Path ".env" -ItemType File -Force
notepad .env
```

### Windows (Explorador de Arquivos):
1. Abra a pasta do projeto
2. Clique com botão direito → Novo → Documento de Texto
3. Renomeie para `.env` (incluindo o ponto no início)
4. Se o Windows perguntar sobre mudar a extensão, clique em "Sim"
5. Abra o arquivo com seu editor favorito
6. Cole o conteúdo acima

### Linux/Mac:
```bash
# Na pasta raiz do projeto
nano .env
# ou
vim .env
# ou
code .env
```

## 🧪 Testar a Configuração

Após criar o arquivo `.env`:

1. **Reinicie o servidor de desenvolvimento:**
   ```bash
   # Pare o servidor (Ctrl + C)
   # E inicie novamente:
   npm start
   ```

2. **Verifique se as variáveis foram carregadas:**
   - Abra o console do navegador (F12)
   - Digite: `console.log(process.env.REACT_APP_SUPABASE_URL)`
   - Deve aparecer: `https://fycxzrsxddwzpeprgyxt.supabase.co`

3. **Teste o sistema:**
   - Acesse a landing page
   - Preencha e envie o formulário
   - Faça login no dashboard
   - Verifique se os dados aparecem

## 🚨 Erros Comuns

### "Cannot read property of undefined"
**Causa**: Variáveis de ambiente não foram carregadas

**Solução**: 
1. Verifique se o arquivo `.env` está na raiz do projeto
2. Confirme que os prefixos são `REACT_APP_`
3. Reinicie o servidor de desenvolvimento

### "Failed to fetch" ou "Network Error"
**Causa**: URL do Supabase incorreta ou servidor offline

**Solução**:
1. Verifique a URL no arquivo `.env`
2. Confirme que o projeto Supabase está ativo
3. Teste a URL no navegador

### Variáveis aparecem como `undefined`
**Causa**: Servidor não foi reiniciado após criar o `.env`

**Solução**: Sempre reinicie o servidor após modificar o `.env`

## 📋 Checklist

- [ ] Arquivo `.env` criado na raiz do projeto
- [ ] Variáveis com prefixo correto (`REACT_APP_`)
- [ ] Servidor de desenvolvimento reiniciado
- [ ] Variáveis testadas no console
- [ ] Formulário testado (envia dados)
- [ ] Dashboard testado (lista dados)

## 🔄 Próximos Passos

Após configurar o `.env`:

1. ✅ Execute o script SQL no Supabase (veja `SETUP_DATABASE.md`)
2. ✅ Inicie o servidor: `npm start`
3. ✅ Teste o formulário na landing page
4. ✅ Faça login no dashboard
5. ✅ Verifique se os leads aparecem

## 💡 Dica

Para ambientes diferentes (desenvolvimento, produção), você pode criar:
- `.env.development` - Para desenvolvimento
- `.env.production` - Para produção
- `.env.local` - Para testes locais (sobrescreve as outras)

Todos esses arquivos já estão no `.gitignore` para segurança.

---

**Suas Credenciais:**
- **Projeto Supabase**: `fycxzrsxddwzpeprgyxt`
- **URL**: `https://fycxzrsxddwzpeprgyxt.supabase.co`
- **Região**: Padrão do Supabase
- **Expira em**: 28/05/2035 (baseado no JWT)

⚠️ **Mantenha estas credenciais em segurança e não as compartilhe publicamente!**

