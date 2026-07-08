// api/top-partners.js
// Retorna o ranking público dos top parceiros por número de vendas fechadas (sem autenticação)
// Apenas mostra nome (anonimizado) e contagem — sem dados sensíveis

const { createClient } = require('@supabase/supabase-js');

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ success: false, error: 'Método não permitido' });

  try {
    const limit = Math.min(parseInt(req.query.limit || '5', 10), 10);

    // Buscar todos os parceiros aprovados
    const { data: partners, error: pErr } = await supabaseAdmin
      .from('partners')
      .select('id, name')
      .eq('status', 'Aprovado');

    if (pErr) throw pErr;
    if (!partners || partners.length === 0) {
      return res.status(200).json({ success: true, data: [] });
    }

    // Para cada parceiro, contar vendas fechadas (indicações com status final)
    const CLOSED_STATUSES = ['Pagamento', 'Em desenvolvimento', 'Entregue', 'Finalizado'];

    const withStats = await Promise.all(partners.map(async (p) => {
      const { data: refs } = await supabaseAdmin
        .from('referrals')
        .select('status')
        .eq('partner_id', p.id)
        .in('status', CLOSED_STATUSES);

      return {
        id: p.id,
        // Anonimizar: mostrar apenas primeiro nome + inicial do sobrenome
        display_name: formatName(p.name),
        closed_referrals: refs ? refs.length : 0
      };
    }));

    // Ordenar por fechados desc e pegar top N
    const ranked = withStats
      .sort((a, b) => b.closed_referrals - a.closed_referrals)
      .slice(0, limit)
      .map((p, i) => ({ ...p, position: i + 1 }));

    return res.status(200).json({ success: true, data: ranked });

  } catch (err) {
    console.error('[top-partners] Erro:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
};

function formatName(fullName) {
  if (!fullName) return 'Parceiro';
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 1) return parts[0];
  return `${parts[0]} ${parts[1].charAt(0)}.`;
}
