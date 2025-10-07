-- =====================================================
-- SISTEMA DE BANCO DE DADOS COMPLETO - AFILIADOSBRASIL
-- =====================================================
-- Este arquivo contém todas as tabelas, índices, políticas
-- e funções necessárias para o projeto Afiliados Brasil
-- =====================================================

-- =====================================================
-- TABELA: submissions
-- Descrição: Armazena os dados dos leads/afiliados
-- =====================================================
CREATE TABLE IF NOT EXISTS submissions (
    id BIGSERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    telefone VARCHAR(30) NOT NULL,
    experiencia_igaming VARCHAR(30) NOT NULL,
    faturamento_mensal VARCHAR(30) NOT NULL,
    fonte_trafego VARCHAR(100) NOT NULL,
    cpf VARCHAR(14) NOT NULL,
    email VARCHAR(100) NOT NULL,
    ip_address VARCHAR(45),
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    contacted BOOLEAN DEFAULT FALSE,
    contact_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Índices para otimizar buscas na tabela submissions
CREATE INDEX IF NOT EXISTS idx_submissions_telefone ON submissions(telefone);
CREATE INDEX IF NOT EXISTS idx_submissions_email ON submissions(email);
CREATE INDEX IF NOT EXISTS idx_submissions_cpf ON submissions(cpf);
CREATE INDEX IF NOT EXISTS idx_submissions_submitted_at ON submissions(submitted_at DESC);
CREATE INDEX IF NOT EXISTS idx_submissions_contacted ON submissions(contacted);
CREATE INDEX IF NOT EXISTS idx_submissions_experiencia ON submissions(experiencia_igaming);

-- Comentários explicativos para a tabela submissions
COMMENT ON TABLE submissions IS 'Armazena todos os leads e afiliados que preencheram o formulário';
COMMENT ON COLUMN submissions.nome IS 'Nome completo do afiliado';
COMMENT ON COLUMN submissions.telefone IS 'Número de telefone/WhatsApp do afiliado';
COMMENT ON COLUMN submissions.experiencia_igaming IS 'Experiência com iGaming: SIM, NÃO ou NÃO SEI O QUE É';
COMMENT ON COLUMN submissions.faturamento_mensal IS 'Faixa de faturamento mensal no mercado de iGaming';
COMMENT ON COLUMN submissions.fonte_trafego IS 'Principal fonte de tráfego utilizada pelo afiliado';
COMMENT ON COLUMN submissions.cpf IS 'CPF do afiliado (sem formatação)';
COMMENT ON COLUMN submissions.email IS 'Email de contato do afiliado';
COMMENT ON COLUMN submissions.ip_address IS 'Endereço IP de onde foi feita a submissão';
COMMENT ON COLUMN submissions.submitted_at IS 'Data e hora da submissão do formulário';
COMMENT ON COLUMN submissions.contacted IS 'Indica se o lead já foi contatado';
COMMENT ON COLUMN submissions.contact_date IS 'Data e hora em que o lead foi contatado';

-- =====================================================
-- TABELA: page_views
-- Descrição: Registra todas as visualizações da landing page
-- =====================================================
CREATE TABLE IF NOT EXISTS page_views (
    id BIGSERIAL PRIMARY KEY,
    ip_address VARCHAR(45) NOT NULL,
    location JSONB,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Índices para otimizar buscas na tabela page_views
CREATE INDEX IF NOT EXISTS idx_page_views_ip ON page_views(ip_address);
CREATE INDEX IF NOT EXISTS idx_page_views_timestamp ON page_views(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_page_views_location ON page_views USING GIN(location);

-- Comentários explicativos para a tabela page_views
COMMENT ON TABLE page_views IS 'Registra todas as visualizações da landing page para análise de tráfego';
COMMENT ON COLUMN page_views.ip_address IS 'Endereço IP do visitante';
COMMENT ON COLUMN page_views.location IS 'Dados de localização do visitante (cidade, região, país) em formato JSON';
COMMENT ON COLUMN page_views.timestamp IS 'Data e hora da visualização';
COMMENT ON COLUMN page_views.user_agent IS 'Informações do navegador e sistema operacional do visitante';

-- =====================================================
-- FUNÇÃO: update_updated_at_column
-- Descrição: Atualiza automaticamente o campo updated_at
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para atualizar automaticamente o campo updated_at na tabela submissions
DROP TRIGGER IF EXISTS update_submissions_updated_at ON submissions;
CREATE TRIGGER update_submissions_updated_at
    BEFORE UPDATE ON submissions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- POLÍTICAS DE SEGURANÇA (RLS - Row Level Security)
-- =====================================================

-- Habilitar RLS nas tabelas
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;

-- Política: Usuários autenticados podem ler todos os dados de submissions
DROP POLICY IF EXISTS "Usuários autenticados podem ler submissions" ON submissions;
CREATE POLICY "Usuários autenticados podem ler submissions"
    ON submissions FOR SELECT
    TO authenticated
    USING (true);

-- Política: Qualquer pessoa pode inserir em submissions (necessário para o formulário público)
DROP POLICY IF EXISTS "Qualquer um pode inserir submissions" ON submissions;
CREATE POLICY "Qualquer um pode inserir submissions"
    ON submissions FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

-- Política: Usuários autenticados podem atualizar submissions
DROP POLICY IF EXISTS "Usuários autenticados podem atualizar submissions" ON submissions;
CREATE POLICY "Usuários autenticados podem atualizar submissions"
    ON submissions FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Política: Usuários autenticados podem deletar submissions
DROP POLICY IF EXISTS "Usuários autenticados podem deletar submissions" ON submissions;
CREATE POLICY "Usuários autenticados podem deletar submissions"
    ON submissions FOR DELETE
    TO authenticated
    USING (true);

-- Política: Usuários autenticados podem ler page_views
DROP POLICY IF EXISTS "Usuários autenticados podem ler page_views" ON page_views;
CREATE POLICY "Usuários autenticados podem ler page_views"
    ON page_views FOR SELECT
    TO authenticated
    USING (true);

-- Política: Qualquer pessoa pode inserir em page_views (necessário para rastrear visitas)
DROP POLICY IF EXISTS "Qualquer um pode inserir page_views" ON page_views;
CREATE POLICY "Qualquer um pode inserir page_views"
    ON page_views FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

-- =====================================================
-- VIEWS (VISUALIZAÇÕES) ÚTEIS
-- =====================================================

-- View: Estatísticas gerais de submissions
DROP VIEW IF EXISTS vw_submission_stats;
CREATE VIEW vw_submission_stats AS
SELECT
    COUNT(*) as total_submissions,
    COUNT(CASE WHEN contacted = true THEN 1 END) as total_contacted,
    COUNT(CASE WHEN contacted = false THEN 1 END) as total_pending,
    COUNT(CASE WHEN experiencia_igaming = 'SIM' THEN 1 END) as experientes,
    COUNT(CASE WHEN experiencia_igaming = 'NÃO' THEN 1 END) as iniciantes,
    COUNT(CASE WHEN experiencia_igaming = 'NÃO SEI O QUE É' THEN 1 END) as potenciais,
    COUNT(DISTINCT DATE(submitted_at)) as dias_com_submissoes,
    MAX(submitted_at) as ultima_submissao,
    MIN(submitted_at) as primeira_submissao
FROM submissions;

COMMENT ON VIEW vw_submission_stats IS 'Estatísticas gerais sobre as submissões de afiliados';

-- View: Submissions agrupadas por dia
DROP VIEW IF EXISTS vw_submissions_por_dia;
CREATE VIEW vw_submissions_por_dia AS
SELECT
    DATE(submitted_at) as data,
    COUNT(*) as total,
    COUNT(CASE WHEN experiencia_igaming = 'SIM' THEN 1 END) as experientes,
    COUNT(CASE WHEN experiencia_igaming = 'NÃO' THEN 1 END) as iniciantes,
    COUNT(CASE WHEN experiencia_igaming = 'NÃO SEI O QUE É' THEN 1 END) as potenciais,
    COUNT(CASE WHEN contacted = true THEN 1 END) as contactados
FROM submissions
GROUP BY DATE(submitted_at)
ORDER BY DATE(submitted_at) DESC;

COMMENT ON VIEW vw_submissions_por_dia IS 'Submissões agrupadas por dia para análise de tendências';

-- View: Estatísticas de visualizações de página
DROP VIEW IF EXISTS vw_page_view_stats;
CREATE VIEW vw_page_view_stats AS
SELECT
    COUNT(*) as total_views,
    COUNT(DISTINCT ip_address) as unique_visitors,
    COUNT(DISTINCT DATE(timestamp)) as dias_com_visitas,
    MAX(timestamp) as ultima_visita,
    MIN(timestamp) as primeira_visita
FROM page_views;

COMMENT ON VIEW vw_page_view_stats IS 'Estatísticas gerais sobre as visualizações da página';

-- View: Visualizações agrupadas por dia
DROP VIEW IF EXISTS vw_views_por_dia;
CREATE VIEW vw_views_por_dia AS
SELECT
    DATE(timestamp) as data,
    COUNT(*) as total_views,
    COUNT(DISTINCT ip_address) as unique_visitors
FROM page_views
GROUP BY DATE(timestamp)
ORDER BY DATE(timestamp) DESC;

COMMENT ON VIEW vw_views_por_dia IS 'Visualizações agrupadas por dia';

-- View: Localização dos visitantes (top 10 cidades)
DROP VIEW IF EXISTS vw_top_locations;
CREATE VIEW vw_top_locations AS
SELECT
    location->>'city' as cidade,
    location->>'region' as regiao,
    location->>'country' as pais,
    COUNT(*) as total_visitas
FROM page_views
WHERE location IS NOT NULL
GROUP BY location->>'city', location->>'region', location->>'country'
ORDER BY total_visitas DESC
LIMIT 10;

COMMENT ON VIEW vw_top_locations IS 'Top 10 cidades com mais visualizações';

-- =====================================================
-- FUNÇÃO: get_conversion_rate
-- Descrição: Calcula a taxa de conversão (submissões/visualizações)
-- =====================================================
CREATE OR REPLACE FUNCTION get_conversion_rate()
RETURNS NUMERIC AS $$
DECLARE
    total_views INTEGER;
    total_submissions INTEGER;
    conversion_rate NUMERIC;
BEGIN
    SELECT COUNT(DISTINCT ip_address) INTO total_views FROM page_views;
    SELECT COUNT(*) INTO total_submissions FROM submissions;
    
    IF total_views > 0 THEN
        conversion_rate := (total_submissions::NUMERIC / total_views::NUMERIC) * 100;
    ELSE
        conversion_rate := 0;
    END IF;
    
    RETURN ROUND(conversion_rate, 2);
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION get_conversion_rate() IS 'Calcula a taxa de conversão de visitantes em submissões (%)';

-- =====================================================
-- ÍNDICES ADICIONAIS PARA PERFORMANCE
-- =====================================================

-- Índice para busca por range de datas em submissions
CREATE INDEX IF NOT EXISTS idx_submissions_date_range 
ON submissions(submitted_at) 
WHERE submitted_at IS NOT NULL;

-- Índice para busca por range de datas em page_views
CREATE INDEX IF NOT EXISTS idx_page_views_date_range 
ON page_views(timestamp) 
WHERE timestamp IS NOT NULL;

-- Índice composto para filtros comuns
CREATE INDEX IF NOT EXISTS idx_submissions_exp_contacted 
ON submissions(experiencia_igaming, contacted);

-- =====================================================
-- DADOS INICIAIS / CONSTRAINTS
-- =====================================================

-- Constraint: Validar formato de email
ALTER TABLE submissions 
DROP CONSTRAINT IF EXISTS chk_email_format;

ALTER TABLE submissions 
ADD CONSTRAINT chk_email_format 
CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');

-- Constraint: Validar CPF (apenas números, 11 dígitos)
ALTER TABLE submissions 
DROP CONSTRAINT IF EXISTS chk_cpf_format;

ALTER TABLE submissions 
ADD CONSTRAINT chk_cpf_format 
CHECK (cpf ~ '^[0-9]{11}$');

-- Constraint: Validar experiência (valores permitidos)
ALTER TABLE submissions 
DROP CONSTRAINT IF EXISTS chk_experiencia_values;

ALTER TABLE submissions 
ADD CONSTRAINT chk_experiencia_values 
CHECK (experiencia_igaming IN ('SIM', 'NÃO', 'NÃO SEI O QUE É'));

-- =====================================================
-- LIMPEZA E MANUTENÇÃO
-- =====================================================

-- Função para limpar page_views antigas (mais de 90 dias)
CREATE OR REPLACE FUNCTION cleanup_old_page_views()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM page_views 
    WHERE timestamp < CURRENT_TIMESTAMP - INTERVAL '90 days';
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION cleanup_old_page_views() IS 'Remove visualizações de página com mais de 90 dias';

-- =====================================================
-- GRANTS (PERMISSÕES)
-- =====================================================

-- Conceder permissões ao usuário anônimo (para formulário público)
GRANT USAGE ON SCHEMA public TO anon;
GRANT INSERT ON submissions TO anon;
GRANT INSERT ON page_views TO anon;

-- Conceder permissões ao usuário autenticado (para dashboard)
GRANT ALL ON submissions TO authenticated;
GRANT ALL ON page_views TO authenticated;
GRANT SELECT ON vw_submission_stats TO authenticated;
GRANT SELECT ON vw_submissions_por_dia TO authenticated;
GRANT SELECT ON vw_page_view_stats TO authenticated;
GRANT SELECT ON vw_views_por_dia TO authenticated;
GRANT SELECT ON vw_top_locations TO authenticated;
GRANT EXECUTE ON FUNCTION get_conversion_rate() TO authenticated;

-- =====================================================
-- FIM DO SCRIPT
-- =====================================================

-- Mensagens de sucesso
DO $$
BEGIN
    RAISE NOTICE '✅ Tabelas criadas com sucesso!';
    RAISE NOTICE '✅ Índices criados com sucesso!';
    RAISE NOTICE '✅ Políticas de segurança configuradas!';
    RAISE NOTICE '✅ Views e funções criadas!';
    RAISE NOTICE '✅ Sistema de banco de dados está pronto para uso!';
    RAISE NOTICE '';
    RAISE NOTICE '📊 Para ver estatísticas, execute: SELECT * FROM vw_submission_stats;';
    RAISE NOTICE '📈 Para ver taxa de conversão, execute: SELECT get_conversion_rate();';
END $$;
