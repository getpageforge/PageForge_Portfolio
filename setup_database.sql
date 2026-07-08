-- ==========================================================
-- PageForge - Programa de Parceiros - Configuração SQL
-- Rode este script no SQL Editor do seu Supabase.
-- ==========================================================

-- 1. Tabela de Parceiros (Partners)
CREATE TABLE public.partners (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE, -- Vincula ao usuário de auth para o login
    name TEXT NOT NULL,
    whatsapp TEXT NOT NULL,
    instagram TEXT,
    city TEXT,
    how_knew TEXT,
    experience TEXT,
    status TEXT DEFAULT 'Pendente', -- Pendente, Aprovado, Bloqueado
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ativar RLS e criar políticas para Parceiros (Opcional, recomendado para segurança)
ALTER TABLE public.partners ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Parceiros podem ler seus próprios dados" 
ON public.partners FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Parceiros podem atualizar seus próprios dados" 
ON public.partners FOR UPDATE 
USING (auth.uid() = user_id);

-- 2. Tabela de Indicações (Referrals)
CREATE TABLE public.referrals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    partner_id UUID REFERENCES public.partners(id) ON DELETE CASCADE,
    client_name TEXT NOT NULL,
    company TEXT,
    phone TEXT NOT NULL,
    instagram TEXT,
    service TEXT,
    notes TEXT,
    status TEXT DEFAULT 'Novo Lead', -- Novo Lead, Contato, Briefing, Orçamento, Negociação, Pagamento, Em desenvolvimento, Entregue, Finalizado
    project_value NUMERIC(10, 2) DEFAULT 0.00,
    commission_percent NUMERIC(5, 2) DEFAULT 0.00,
    commission_value NUMERIC(10, 2) DEFAULT 0.00,
    commission_status TEXT DEFAULT 'Pendente', -- Pendente, Liberada, Paga
    paid_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ativar RLS para Indicações
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Parceiros podem ler suas indicações" 
ON public.referrals FOR SELECT 
USING (partner_id IN (SELECT id FROM public.partners WHERE user_id = auth.uid()));

CREATE POLICY "Parceiros podem criar indicações" 
ON public.referrals FOR INSERT 
WITH CHECK (partner_id IN (SELECT id FROM public.partners WHERE user_id = auth.uid()));

-- Criar trigger para auto-atualizar o updated_at na tabela referrals
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_referrals_modtime
BEFORE UPDATE ON public.referrals
FOR EACH ROW EXECUTE FUNCTION update_modified_column();
