-- =====================================================
-- SCRIPT DE ATUALIZAÇÃO - Remover obrigatoriedade do CPF
-- =====================================================
-- Execute este script no Supabase SQL Editor para atualizar
-- o banco de dados existente
-- =====================================================

-- 1. Tornar a coluna CPF opcional (NULL)
ALTER TABLE submissions 
ALTER COLUMN cpf DROP NOT NULL;

-- 2. Remover constraint antiga de CPF (se existir)
ALTER TABLE submissions 
DROP CONSTRAINT IF EXISTS chk_cpf_format;

-- 3. Adicionar nova constraint que permite NULL
ALTER TABLE submissions 
ADD CONSTRAINT chk_cpf_format 
CHECK (cpf IS NULL OR cpf ~ '^[0-9]{11}$');

-- 4. Atualizar comentário da coluna
COMMENT ON COLUMN submissions.cpf IS 'CPF do afiliado (sem formatação) - OPCIONAL';

-- 5. Verificar se a atualização foi bem-sucedida
DO $$
BEGIN
    RAISE NOTICE '✅ Coluna CPF atualizada com sucesso!';
    RAISE NOTICE 'ℹ️ Agora o CPF é OPCIONAL no formulário.';
    RAISE NOTICE '';
    RAISE NOTICE '📝 Próximos passos:';
    RAISE NOTICE '1. Reinicie o servidor React: npm start';
    RAISE NOTICE '2. Teste o formulário (agora sem campo CPF)';
    RAISE NOTICE '3. Verifique o dashboard';
END $$;

