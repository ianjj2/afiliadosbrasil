-- =====================================================
-- SOLUÇÃO DEFINITIVA - ERRO 42501 (RLS BLOCKING)
-- =====================================================
-- Execute este script no Supabase SQL Editor
-- =====================================================

-- 1. DESABILITAR RLS temporariamente para verificar
ALTER TABLE submissions DISABLE ROW LEVEL SECURITY;
ALTER TABLE page_views DISABLE ROW LEVEL SECURITY;

-- 2. REMOVER TODAS as políticas antigas
DROP POLICY IF EXISTS "Qualquer um pode inserir submissions" ON submissions;
DROP POLICY IF EXISTS "Usuários autenticados podem ler submissions" ON submissions;
DROP POLICY IF EXISTS "Usuários autenticados podem atualizar submissions" ON submissions;
DROP POLICY IF EXISTS "Usuários autenticados podem deletar submissions" ON submissions;
DROP POLICY IF EXISTS "Enable insert for anon users" ON submissions;
DROP POLICY IF EXISTS "Enable read for authenticated users" ON submissions;
DROP POLICY IF EXISTS "Public can insert" ON submissions;

DROP POLICY IF EXISTS "Qualquer um pode inserir page_views" ON page_views;
DROP POLICY IF EXISTS "Usuários autenticados podem ler page_views" ON page_views;
DROP POLICY IF EXISTS "Enable insert for anon users" ON page_views;
DROP POLICY IF EXISTS "Enable read for authenticated users" ON page_views;
DROP POLICY IF EXISTS "Public can insert" ON page_views;

-- 3. REABILITAR RLS
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;

-- 4. CRIAR POLÍTICAS CORRETAS

-- ==================== SUBMISSIONS ====================

-- Política: Permitir INSERT para TODOS (anon + authenticated)
CREATE POLICY "allow_insert_submissions"
ON submissions
FOR INSERT
TO public
WITH CHECK (true);

-- Política: Permitir SELECT apenas para authenticated
CREATE POLICY "allow_select_submissions"
ON submissions
FOR SELECT
TO authenticated
USING (true);

-- Política: Permitir UPDATE apenas para authenticated
CREATE POLICY "allow_update_submissions"
ON submissions
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Política: Permitir DELETE apenas para authenticated
CREATE POLICY "allow_delete_submissions"
ON submissions
FOR DELETE
TO authenticated
USING (true);

-- ==================== PAGE_VIEWS ====================

-- Política: Permitir INSERT para TODOS (anon + authenticated)
CREATE POLICY "allow_insert_page_views"
ON page_views
FOR INSERT
TO public
WITH CHECK (true);

-- Política: Permitir SELECT apenas para authenticated
CREATE POLICY "allow_select_page_views"
ON page_views
FOR SELECT
TO authenticated
USING (true);

-- 5. GARANTIR que anon pode acessar
GRANT USAGE ON SCHEMA public TO anon;
GRANT INSERT ON submissions TO anon;
GRANT INSERT ON page_views TO anon;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO anon;

-- 6. GARANTIR que authenticated tem acesso completo
GRANT ALL ON submissions TO authenticated;
GRANT ALL ON page_views TO authenticated;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- 7. Tornar CPF opcional (se ainda não foi feito)
ALTER TABLE submissions ALTER COLUMN cpf DROP NOT NULL;
ALTER TABLE submissions DROP CONSTRAINT IF EXISTS chk_cpf_format;
ALTER TABLE submissions ADD CONSTRAINT chk_cpf_format 
CHECK (cpf IS NULL OR cpf ~ '^[0-9]{11}$');

-- 8. Verificação final
DO $$
DECLARE
    policies_count INTEGER;
BEGIN
    -- Contar políticas criadas
    SELECT COUNT(*) INTO policies_count
    FROM pg_policies
    WHERE schemaname = 'public' 
    AND tablename IN ('submissions', 'page_views');
    
    RAISE NOTICE '========================================';
    RAISE NOTICE '✅ POLÍTICAS RLS CONFIGURADAS!';
    RAISE NOTICE '========================================';
    RAISE NOTICE '';
    RAISE NOTICE '✅ % políticas criadas', policies_count;
    RAISE NOTICE '✅ Permissões concedidas';
    RAISE NOTICE '✅ CPF opcional';
    RAISE NOTICE '✅ Usuários anônimos podem inserir';
    RAISE NOTICE '✅ Usuários autenticados podem gerenciar';
    RAISE NOTICE '';
    RAISE NOTICE '🎯 AGORA TESTE O FORMULÁRIO!';
    RAISE NOTICE '';
    RAISE NOTICE 'Se ainda der erro, execute:';
    RAISE NOTICE 'SELECT * FROM pg_policies WHERE tablename IN (''submissions'', ''page_views'');';
END $$;

-- 9. Mostrar políticas criadas (para confirmar)
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename IN ('submissions', 'page_views')
ORDER BY tablename, policyname;

