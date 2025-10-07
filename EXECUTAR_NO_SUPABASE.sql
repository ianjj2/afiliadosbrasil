-- =====================================================
-- COPIE E EXECUTE ESTE SCRIPT NO SUPABASE SQL EDITOR
-- =====================================================
-- Projeto: fycxzrsxddwzpeprgyxt
-- Este script corrige todos os problemas de 401
-- =====================================================

-- 1. Tornar CPF opcional na tabela submissions
ALTER TABLE submissions ALTER COLUMN cpf DROP NOT NULL;

-- 2. Atualizar constraint do CPF
ALTER TABLE submissions DROP CONSTRAINT IF EXISTS chk_cpf_format;
ALTER TABLE submissions ADD CONSTRAINT chk_cpf_format 
CHECK (cpf IS NULL OR cpf ~ '^[0-9]{11}$');

-- 3. Habilitar RLS (Row Level Security)
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;

-- 4. POLÍTICAS para SUBMISSIONS
-- Permitir inserção anônima (necessário para o formulário)
DROP POLICY IF EXISTS "Qualquer um pode inserir submissions" ON submissions;
CREATE POLICY "Qualquer um pode inserir submissions"
    ON submissions FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

-- Permitir leitura para usuários autenticados
DROP POLICY IF EXISTS "Usuários autenticados podem ler submissions" ON submissions;
CREATE POLICY "Usuários autenticados podem ler submissions"
    ON submissions FOR SELECT
    TO authenticated
    USING (true);

-- Permitir atualização para usuários autenticados
DROP POLICY IF EXISTS "Usuários autenticados podem atualizar submissions" ON submissions;
CREATE POLICY "Usuários autenticados podem atualizar submissions"
    ON submissions FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Permitir exclusão para usuários autenticados
DROP POLICY IF EXISTS "Usuários autenticados podem deletar submissions" ON submissions;
CREATE POLICY "Usuários autenticados podem deletar submissions"
    ON submissions FOR DELETE
    TO authenticated
    USING (true);

-- 5. POLÍTICAS para PAGE_VIEWS
-- Permitir inserção anônima (necessário para rastrear visitas)
DROP POLICY IF EXISTS "Qualquer um pode inserir page_views" ON page_views;
CREATE POLICY "Qualquer um pode inserir page_views"
    ON page_views FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

-- Permitir leitura para usuários autenticados
DROP POLICY IF EXISTS "Usuários autenticados podem ler page_views" ON page_views;
CREATE POLICY "Usuários autenticados podem ler page_views"
    ON page_views FOR SELECT
    TO authenticated
    USING (true);

-- 6. Verificação final
DO $$
BEGIN
    RAISE NOTICE '========================================';
    RAISE NOTICE '✅ BANCO DE DADOS ATUALIZADO COM SUCESSO!';
    RAISE NOTICE '========================================';
    RAISE NOTICE '';
    RAISE NOTICE '✅ CPF agora é opcional';
    RAISE NOTICE '✅ RLS habilitado';
    RAISE NOTICE '✅ Políticas configuradas corretamente';
    RAISE NOTICE '';
    RAISE NOTICE '📋 PRÓXIMOS PASSOS:';
    RAISE NOTICE '1. Volte para o terminal';
    RAISE NOTICE '2. Execute: npm start';
    RAISE NOTICE '3. Teste o formulário';
    RAISE NOTICE '';
    RAISE NOTICE '🎯 O erro 401 deve estar resolvido!';
END $$;

