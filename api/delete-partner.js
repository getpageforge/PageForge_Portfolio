// api/delete-partner.js
// Remove um parceiro e todas as suas indicações (CASCADE via FK)

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
  res.setHeader('Access-Control-Allow-Methods', 'DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'DELETE') {
    return res.status(405).json({ success: false, error: 'Método não permitido' });
  }

  if (!verifyToken(req)) {
    return res.status(401).json({ success: false, error: 'Não autorizado' });
  }

  const { id } = req.query;
  if (!id) return res.status(400).json({ success: false, error: 'ID do parceiro é obrigatório' });

  try {
    // Verificar se parceiro existe
    const { data: partner, error: checkErr } = await supabaseAdmin
      .from('partners')
      .select('id, name')
      .eq('id', id)
      .single();

    if (checkErr || !partner) {
      return res.status(404).json({ success: false, error: 'Parceiro não encontrado' });
    }

    // Deletar indicações do parceiro primeiro (caso não haja CASCADE configurado)
    await supabaseAdmin.from('referrals').delete().eq('partner_id', id);

    // Deletar parceiro
    const { error: delErr } = await supabaseAdmin
      .from('partners')
      .delete()
      .eq('id', id);

    if (delErr) throw delErr;

    return res.status(200).json({
      success: true,
      message: `Parceiro "${partner.name}" removido com sucesso`
    });

  } catch (err) {
    console.error('[delete-partner] Erro:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
};
