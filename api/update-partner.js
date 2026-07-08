// api/update-partner.js
// Atualiza status ou dados de um parceiro (Aprovar, Bloquear, Editar)

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
  res.setHeader('Access-Control-Allow-Methods', 'PATCH, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (!['PATCH', 'PUT'].includes(req.method)) {
    return res.status(405).json({ success: false, error: 'Método não permitido' });
  }

  if (!verifyToken(req)) {
    return res.status(401).json({ success: false, error: 'Não autorizado' });
  }

  const { id } = req.query;
  if (!id) return res.status(400).json({ success: false, error: 'ID do parceiro é obrigatório' });

  try {
    const body = req.body;
    if (!body || Object.keys(body).length === 0) {
      return res.status(400).json({ success: false, error: 'Nenhum dado para atualizar' });
    }

    // Campos permitidos para atualização
    const allowed = ['status', 'name', 'whatsapp', 'instagram', 'city', 'notes'];
    const updateData = {};
    allowed.forEach(field => {
      if (body[field] !== undefined) updateData[field] = body[field];
    });

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ success: false, error: 'Nenhum campo válido para atualizar' });
    }

    // Validar status
    if (updateData.status && !['Pendente', 'Aprovado', 'Bloqueado'].includes(updateData.status)) {
      return res.status(400).json({ success: false, error: 'Status inválido. Use: Pendente, Aprovado ou Bloqueado' });
    }

    const { data, error } = await supabaseAdmin
      .from('partners')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ success: false, error: 'Parceiro não encontrado' });

    return res.status(200).json({
      success: true,
      message: 'Parceiro atualizado com sucesso',
      data
    });

  } catch (err) {
    console.error('[update-partner] Erro:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
};
