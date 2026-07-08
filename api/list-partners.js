// api/list-partners.js
// Lista todos os parceiros com dados agregados de indicações (requer autenticação admin)

const { createClient } = require('@supabase/supabase-js');

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

function verifyToken(req) {
  const auth = req.headers['authorization'] || '';
  const token = auth.replace('Bearer ', '').trim();
  if (!token) return false;
  // Mesmo sistema de token simples usado no admin
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

  try {
    const { search = '', status = '' } = req.query;

    // Buscar parceiros
    let query = supabaseAdmin
      .from('partners')
      .select('*')
      .order('created_at', { ascending: false });

    if (status) query = query.eq('status', status);

    const { data: partners, error: pErr } = await query;
    if (pErr) throw pErr;

    // Buscar todos os usuários do Auth para associar os e-mails
    const { data: authData, error: authErr } = await supabaseAdmin.auth.admin.listUsers();
    const emailMap = {};
    if (authData && authData.users) {
      authData.users.forEach(u => {
        emailMap[u.id] = u.email;
      });
    }

    // Para cada parceiro, buscar contagem de indicações e comissão
    const enriched = await Promise.all(partners.map(async (p) => {
      const partnerEmail = emailMap[p.user_id] || '';
      // Filtro por busca
      if (search) {
        const s = search.toLowerCase();
        const match = (p.name || '').toLowerCase().includes(s) ||
          partnerEmail.toLowerCase().includes(s) ||
          (p.whatsapp || '').toLowerCase().includes(s) ||
          (p.instagram || '').toLowerCase().includes(s);
        if (!match) return null;
      }

      const { data: refs } = await supabaseAdmin
        .from('referrals')
        .select('status, commission_value, commission_status')
        .eq('partner_id', p.id);

      const totalRefs = refs ? refs.length : 0;
      const closedRefs = refs ? refs.filter(r =>
        ['Pagamento', 'Em desenvolvimento', 'Entregue', 'Finalizado'].includes(r.status)
      ).length : 0;
      const totalCommission = refs ? refs
        .filter(r => r.commission_status === 'Paga')
        .reduce((sum, r) => sum + Number(r.commission_value || 0), 0) : 0;
      const pendingCommission = refs ? refs
        .filter(r => r.commission_status === 'Liberada')
        .reduce((sum, r) => sum + Number(r.commission_value || 0), 0) : 0;

      return {
        ...p,
        email: partnerEmail,
        total_referrals: totalRefs,
        closed_referrals: closedRefs,
        total_commission_paid: totalCommission,
        total_commission_pending: pendingCommission
      };
    }));

    const filtered = enriched.filter(Boolean);

    return res.status(200).json({
      success: true,
      data: filtered,
      total: filtered.length
    });

  } catch (err) {
    console.error('[list-partners] Erro:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
};
