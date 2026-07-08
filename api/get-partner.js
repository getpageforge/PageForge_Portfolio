// api/get-partner.js
// Retorna detalhes completos de um parceiro incluindo todas as indicações e timeline

const { createClient } = require('@supabase/supabase-js');

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

function verifyToken(req) {
  const auth = req.headers['authorization'] || '';
  const token = auth.replace('Bearer ', '').trim();
  if (!token) return false;
  try {
    const decoded = Buffer.from(token, 'base64').toString('utf8');
    const parsed = JSON.parse(decoded);
    return parsed.role === 'admin' && new Date(parsed.expires) > new Date();
  } catch {
    return false;
  }
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ success: false, error: 'Método não permitido' });

  if (!verifyToken(req)) {
    return res.status(401).json({ success: false, error: 'Não autorizado' });
  }

  const { id } = req.query;
  if (!id) return res.status(400).json({ success: false, error: 'ID do parceiro é obrigatório' });

  try {
    // Buscar parceiro
    const { data: partner, error: pErr } = await supabaseAdmin
      .from('partners')
      .select('*')
      .eq('id', id)
      .single();

    if (pErr || !partner) {
      return res.status(404).json({ success: false, error: 'Parceiro não encontrado' });
    }

    // Buscar todas as indicações do parceiro
    const { data: referrals, error: rErr } = await supabaseAdmin
      .from('referrals')
      .select('*')
      .eq('partner_id', id)
      .order('created_at', { ascending: false });

    if (rErr) throw rErr;

    // Calcular estatísticas
    const totalRefs = referrals ? referrals.length : 0;
    const closedRefs = referrals ? referrals.filter(r =>
      ['Pagamento', 'Em desenvolvimento', 'Entregue', 'Finalizado'].includes(r.status)
    ).length : 0;
    const totalRevenue = referrals ? referrals
      .filter(r => ['Pagamento', 'Em desenvolvimento', 'Entregue', 'Finalizado'].includes(r.status))
      .reduce((sum, r) => sum + Number(r.project_value || 0), 0) : 0;
    const totalCommPaid = referrals ? referrals
      .filter(r => r.commission_status === 'Paga')
      .reduce((sum, r) => sum + Number(r.commission_value || 0), 0) : 0;
    const totalCommPending = referrals ? referrals
      .filter(r => r.commission_status === 'Liberada')
      .reduce((sum, r) => sum + Number(r.commission_value || 0), 0) : 0;

    // Timeline: cadastro + mudanças de status das indicações + atualizações do parceiro
    const timeline = [];
    timeline.push({
      type: 'cadastro',
      label: 'Parceiro cadastrado',
      date: partner.created_at,
      icon: 'user-plus'
    });

    if (referrals) {
      referrals.forEach(r => {
        timeline.push({
          type: 'indicacao',
          label: `Nova indicação: ${r.client_name}`,
          date: r.created_at,
          icon: 'user-plus',
          data: { status: r.status, client: r.client_name }
        });
        if (r.updated_at && r.updated_at !== r.created_at) {
          timeline.push({
            type: 'atualizacao',
            label: `Indicação atualizada: ${r.client_name} → ${r.status}`,
            date: r.updated_at,
            icon: 'pencil',
            data: { status: r.status, client: r.client_name }
          });
        }
        if (r.commission_status === 'Paga' && r.paid_at) {
          timeline.push({
            type: 'comissao',
            label: `Comissão paga: R$ ${Number(r.commission_value).toFixed(2)} (${r.client_name})`,
            date: r.paid_at,
            icon: 'money',
            data: { value: r.commission_value, client: r.client_name }
          });
        }
      });
    }

    // Ordenar timeline por data (mais recente primeiro)
    timeline.sort((a, b) => new Date(b.date) - new Date(a.date));

    const formattedCreatedAt = new Date(partner.created_at).toLocaleDateString('pt-BR', {
      day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });

    return res.status(200).json({
      success: true,
      data: {
        partner: { ...partner, created_at: formattedCreatedAt },
        referrals: referrals ? referrals.map(r => ({
          ...r,
          created_at: new Date(r.created_at).toLocaleDateString('pt-BR'),
          updated_at: r.updated_at ? new Date(r.updated_at).toLocaleDateString('pt-BR') : null
        })) : [],
        stats: {
          total_referrals: totalRefs,
          closed_referrals: closedRefs,
          total_revenue: totalRevenue,
          commission_paid: totalCommPaid,
          commission_pending: totalCommPending
        },
        timeline
      }
    });

  } catch (err) {
    console.error('[get-partner] Erro:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
};
