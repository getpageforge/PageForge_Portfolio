const { createClient } = require('@supabase/supabase-js');
const { verifySignedToken } = require('./validate-token');

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

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
  res.setHeader('Access-Control-Allow-Methods', 'GET, PATCH, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (!verifyToken(req)) return res.status(401).json({ success: false, error: 'Não autorizado' });

  const { id } = req.query;

  try {
    /* ─── GET ─── */
    if (req.method === 'GET') {
      if (id) {
        const { data: partner, error: pErr } = await supabaseAdmin.from('partners').select('*').eq('id', id).single();
        if (pErr || !partner) return res.status(404).json({ success: false, error: 'Parceiro não encontrado' });

        let partnerEmail = '';
        try {
          const { data: userData } = await supabaseAdmin.auth.admin.getUserById(partner.user_id);
          if (userData && userData.user) partnerEmail = userData.user.email;
        } catch (err) { console.warn('[partner] Erro ao buscar e-mail:', err); }

        const { data: referrals, error: rErr } = await supabaseAdmin.from('referrals').select('*').eq('partner_id', id).order('created_at', { ascending: false });
        if (rErr) throw rErr;

        const totalRefs = referrals ? referrals.length : 0;
        const closedRefs = referrals ? referrals.filter(r => ['Pagamento', 'Em desenvolvimento', 'Entregue', 'Finalizado'].includes(r.status)).length : 0;
        const totalRevenue = referrals ? referrals.filter(r => ['Pagamento', 'Em desenvolvimento', 'Entregue', 'Finalizado'].includes(r.status)).reduce((sum, r) => sum + Number(r.project_value || 0), 0) : 0;
        const totalCommPaid = referrals ? referrals.filter(r => r.commission_status === 'Paga').reduce((sum, r) => sum + Number(r.commission_value || 0), 0) : 0;
        const totalCommPending = referrals ? referrals.filter(r => r.commission_status === 'Liberada').reduce((sum, r) => sum + Number(r.commission_value || 0), 0) : 0;

        const timeline = [{ type: 'cadastro', label: 'Parceiro cadastrado', date: partner.created_at, icon: 'user-plus' }];
        if (referrals) {
          referrals.forEach(r => {
            timeline.push({ type: 'indicacao', label: `Nova indicação: ${r.client_name}`, date: r.created_at, icon: 'user-plus', data: { status: r.status, client: r.client_name } });
            if (r.updated_at && r.updated_at !== r.created_at) timeline.push({ type: 'atualizacao', label: `Indicação atualizada: ${r.client_name} → ${r.status}`, date: r.updated_at, icon: 'pencil', data: { status: r.status, client: r.client_name } });
            if (r.commission_status === 'Paga' && r.paid_at) timeline.push({ type: 'comissao', label: `Comissão paga: R$ ${Number(r.commission_value).toFixed(2)} (${r.client_name})`, date: r.paid_at, icon: 'money', data: { value: r.commission_value, client: r.client_name } });
          });
        }
        timeline.sort((a, b) => new Date(b.date) - new Date(a.date));

        const formattedCreatedAt = new Date(partner.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
        return res.status(200).json({
          success: true,
          data: {
            partner: { ...partner, email: partnerEmail, created_at: formattedCreatedAt },
            referrals: referrals ? referrals.map(r => ({ ...r, created_at: new Date(r.created_at).toLocaleDateString('pt-BR'), updated_at: r.updated_at ? new Date(r.updated_at).toLocaleDateString('pt-BR') : null })) : [],
            stats: { total_referrals: totalRefs, closed_referrals: closedRefs, total_revenue: totalRevenue, commission_paid: totalCommPaid, commission_pending: totalCommPending },
            timeline
          }
        });
      }

      const { search = '', status = '' } = req.query;
      let query = supabaseAdmin.from('partners').select('*').order('created_at', { ascending: false });
      if (status) query = query.eq('status', status);
      const { data: partners, error: pErr } = await query;
      if (pErr) throw pErr;

      const { data: authData } = await supabaseAdmin.auth.admin.listUsers();
      const emailMap = {};
      if (authData && authData.users) authData.users.forEach(u => { emailMap[u.id] = u.email; });

      const enriched = await Promise.all(partners.map(async (p) => {
        const partnerEmail = emailMap[p.user_id] || '';
        if (search) {
          const s = search.toLowerCase();
          if (!(p.name || '').toLowerCase().includes(s) && !partnerEmail.toLowerCase().includes(s) && !(p.whatsapp || '').toLowerCase().includes(s) && !(p.instagram || '').toLowerCase().includes(s)) return null;
        }
        const { data: refs } = await supabaseAdmin.from('referrals').select('status, commission_value, commission_status').eq('partner_id', p.id);
        const totalRefs = refs ? refs.length : 0;
        const closedRefs = refs ? refs.filter(r => ['Pagamento', 'Em desenvolvimento', 'Entregue', 'Finalizado'].includes(r.status)).length : 0;
        const totalCommission = refs ? refs.filter(r => r.commission_status === 'Paga').reduce((sum, r) => sum + Number(r.commission_value || 0), 0) : 0;
        const pendingCommission = refs ? refs.filter(r => r.commission_status === 'Liberada').reduce((sum, r) => sum + Number(r.commission_value || 0), 0) : 0;
        return { ...p, email: partnerEmail, total_referrals: totalRefs, closed_referrals: closedRefs, total_commission_paid: totalCommission, total_commission_pending: pendingCommission };
      }));

      const filtered = enriched.filter(Boolean);
      return res.status(200).json({ success: true, data: filtered, total: filtered.length });
    }

    /* ─── PATCH / PUT ─── */
    if (req.method === 'PATCH' || req.method === 'PUT') {
      if (!id) return res.status(400).json({ success: false, error: 'ID do parceiro é obrigatório' });
      const body = req.body;
      if (!body || Object.keys(body).length === 0) return res.status(400).json({ success: false, error: 'Nenhum dado para atualizar' });
      const allowed = ['status', 'name', 'whatsapp', 'instagram', 'city', 'notes'];
      const updateData = {};
      allowed.forEach(field => { if (body[field] !== undefined) updateData[field] = body[field]; });
      if (Object.keys(updateData).length === 0) return res.status(400).json({ success: false, error: 'Nenhum campo válido para atualizar' });
      if (updateData.status && !['Pendente', 'Aprovado', 'Bloqueado'].includes(updateData.status)) return res.status(400).json({ success: false, error: 'Status inválido. Use: Pendente, Aprovado ou Bloqueado' });
      const { data, error } = await supabaseAdmin.from('partners').update(updateData).eq('id', id).select().single();
      if (error) throw error;
      if (!data) return res.status(404).json({ success: false, error: 'Parceiro não encontrado' });
      return res.status(200).json({ success: true, message: 'Parceiro atualizado com sucesso', data });
    }

    /* ─── DELETE ─── */
    if (req.method === 'DELETE') {
      if (!id) return res.status(400).json({ success: false, error: 'ID do parceiro é obrigatório' });
      const { data: partner, error: checkErr } = await supabaseAdmin.from('partners').select('id, name, user_id').eq('id', id).single();
      if (checkErr || !partner) return res.status(404).json({ success: false, error: 'Parceiro não encontrado' });
      await supabaseAdmin.from('referrals').delete().eq('partner_id', id);
      let authDeleted = true;
      if (partner.user_id) {
        const { error: authErr } = await supabaseAdmin.auth.admin.deleteUser(partner.user_id);
        if (authErr) { console.error('[partner] Erro ao deletar usuário do Auth:', authErr); authDeleted = false; }
      }
      const { error: delErr } = await supabaseAdmin.from('partners').delete().eq('id', id);
      if (delErr) throw delErr;
      return res.status(200).json({ success: true, message: `Parceiro "${partner.name}" removido com sucesso${!authDeleted ? ' (exceto usuário no Auth, que precisará ser removido manualmente)' : ''}` });
    }

    return res.status(405).json({ success: false, error: 'Método não permitido' });
  } catch (err) {
    console.error('[partner] Erro:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
};
