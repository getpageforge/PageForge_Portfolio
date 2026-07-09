// api/list-leads.js
// Retorna todos os leads (indicações) com dados do parceiro (requer autenticação admin)

const { createClient } = require('@supabase/supabase-js');

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

const crypto = require('crypto');

function verifySignedToken(token, secret) {
  try {
    const parts = token.split('.');
    if (parts.length !== 2) return null;
    const [payloadB64, signature] = parts;
    const hmac = crypto.createHmac('sha256', secret);
    hmac.update(payloadB64);
    const expectedSig = hmac.digest('base64url');
    if (signature !== expectedSig) return null;
    const payload = JSON.parse(Buffer.from(payloadB64, 'base64url').toString('utf8'));
    if (payload.exp && Date.now() > payload.exp) return null;
    return payload;
  } catch { return null; }
}

function verifyToken(req) {
  const auth = req.headers['authorization'] || '';
  const token = auth.replace('Bearer ', '').trim();
  if (!token) return false;
  const ADMIN_PASSWORD = (process.env.ADMIN_PASSWORD || '').trim();
  const payload = verifySignedToken(token, ADMIN_PASSWORD);
  return payload && payload.role === 'admin';
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
    const { partner_id = '', status = '', search = '' } = req.query;

    // Buscar todas as indicações
    let query = supabaseAdmin
      .from('referrals')
      .select('*')
      .order('created_at', { ascending: false });

    if (partner_id) query = query.eq('partner_id', partner_id);
    if (status) query = query.eq('status', status);

    const { data: referrals, error: rErr } = await query;
    if (rErr) throw rErr;

    // Buscar parceiros para associar nomes
    const { data: partners, error: pErr } = await supabaseAdmin
      .from('partners')
      .select('id, name');
    if (pErr) throw pErr;

    const partnerMap = {};
    if (partners) {
      partners.forEach(p => { partnerMap[p.id] = p.name; });
    }

    // Montar resposta
    let enriched = (referrals || []).map(r => ({
      id: r.id,
      client_name: r.client_name,
      company: r.company || '',
      phone: r.phone || '',
      instagram: r.instagram || '',
      service: r.service || '',
      notes: r.notes || '',
      status: r.status || 'Novo Lead',
      commission_status: r.commission_status || '',
      commission_value: r.commission_value || 0,
      project_value: r.project_value || 0,
      partner_id: r.partner_id,
      partner_name: partnerMap[r.partner_id] || 'Desconhecido',
      created_at: r.created_at,
      updated_at: r.updated_at
    }));

    // Filtro por busca textual
    if (search) {
      const s = search.toLowerCase();
      enriched = enriched.filter(r =>
        (r.client_name || '').toLowerCase().includes(s) ||
        (r.company || '').toLowerCase().includes(s) ||
        (r.partner_name || '').toLowerCase().includes(s)
      );
    }

    return res.status(200).json({
      success: true,
      data: enriched,
      total: enriched.length
    });

  } catch (err) {
    console.error('[list-leads] Erro:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
};
