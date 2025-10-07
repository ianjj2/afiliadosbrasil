-- =====================================================
-- DIAGNÓSTICO - Verificar estado atual do RLS
-- =====================================================
-- Execute este script ANTES de corrigir para ver o problema
-- =====================================================

-- 1. Verificar se RLS está habilitado
SELECT 
    schemaname,
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('submissions', 'page_views');

-- 2. Listar TODAS as políticas atuais
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd as comando,
    CASE 
        WHEN qual IS NOT NULL THEN 'USING: ' || qual
        ELSE 'SEM USING'
    END as using_clause,
    CASE 
        WHEN with_check IS NOT NULL THEN 'WITH CHECK: ' || with_check
        ELSE 'SEM WITH CHECK'
    END as check_clause
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename IN ('submissions', 'page_views')
ORDER BY tablename, policyname;

-- 3. Verificar permissões do role anon
SELECT 
    grantee,
    table_schema,
    table_name,
    privilege_type
FROM information_schema.table_privileges
WHERE grantee = 'anon'
AND table_schema = 'public'
AND table_name IN ('submissions', 'page_views')
ORDER BY table_name, privilege_type;

-- 4. Verificar permissões do role authenticated
SELECT 
    grantee,
    table_schema,
    table_name,
    privilege_type
FROM information_schema.table_privileges
WHERE grantee = 'authenticated'
AND table_schema = 'public'
AND table_name IN ('submissions', 'page_views')
ORDER BY table_name, privilege_type;

-- 5. Verificar estrutura da tabela submissions
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name = 'submissions'
ORDER BY ordinal_position;

