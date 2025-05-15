-- Estrutura da tabela submissions para Supabase/PostgreSQL
CREATE TABLE IF NOT EXISTS submissions (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    telefone VARCHAR(30) NOT NULL,
    experiencia_igaming VARCHAR(30) NOT NULL,
    faturamento_mensal VARCHAR(30) NOT NULL,
    fonte_trafego VARCHAR(100) NOT NULL,
    cpf VARCHAR(14) NOT NULL,
    email VARCHAR(100) NOT NULL,
    ip_address VARCHAR(45),
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    contacted BOOLEAN DEFAULT FALSE,
    contact_date TIMESTAMP
);

-- Índice para busca rápida por telefone, email ou cpf
CREATE INDEX IF NOT EXISTS idx_submissions_telefone ON submissions(telefone);
CREATE INDEX IF NOT EXISTS idx_submissions_email ON submissions(email);
CREATE INDEX IF NOT EXISTS idx_submissions_cpf ON submissions(cpf); 