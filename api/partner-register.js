// api/partner-register.js
// Cadastro de parceiro usando service_role (bypassa RLS para INSERT na tabela partners)
// Isso resolve o problema onde a anon key pode não ter permissão de INSERT

const { createClient } = require('@supabase/supabase-js');

// Admin client com service_role para criar usuários e inserir dados
const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Método não permitido' });
  }

  try {
    const { email, password, name, whatsapp, instagram, city, how_knew, experience } = req.body;

    // Validações básicas
    if (!email || !password || !name || !whatsapp || !city || !how_knew) {
      return res.status(400).json({
        success: false,
        error: 'Campos obrigatórios: email, password, name, whatsapp, city, how_knew'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, error: 'Senha deve ter pelo menos 6 caracteres' });
    }

    // 1. Criar usuário no Auth
    const { data: authData, error: authErr } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true // Confirma email automaticamente
    });

    if (authErr) {
      if (authErr.message.includes('already registered') || authErr.message.includes('already been registered')) {
        return res.status(409).json({ success: false, error: 'Este e-mail já está cadastrado.' });
      }
      throw authErr;
    }

    const userId = authData.user.id;

    // 2. Verificar se já tem perfil de parceiro (edge case)
    const { data: existing } = await supabaseAdmin
      .from('partners')
      .select('id')
      .eq('user_id', userId)
      .single();

    if (existing) {
      return res.status(409).json({ success: false, error: 'Este usuário já possui um perfil de parceiro.' });
    }

    // 3. Inserir parceiro na tabela
    const { data: partnerData, error: partnerErr } = await supabaseAdmin
      .from('partners')
      .insert([{
        user_id: userId,
        name: name.trim(),
        whatsapp: whatsapp.trim(),
        instagram: (instagram || '').trim(),
        city: city.trim(),
        how_knew: how_knew.trim(),
        experience: (experience || '').trim(),
        status: 'Pendente'
      }])
      .select()
      .single();

    if (partnerErr) {
      // Rollback: remover usuário do Auth se falhou no BD
      await supabaseAdmin.auth.admin.deleteUser(userId);
      throw partnerErr;
    }

    return res.status(201).json({
      success: true,
      message: 'Parceiro cadastrado com sucesso!',
      data: { id: partnerData.id, name: partnerData.name, email: email.trim().toLowerCase() }
    });

  } catch (err) {
    console.error('[partner-register] Erro:', err);
    return res.status(500).json({
      success: false,
      error: err.message || 'Erro interno ao cadastrar parceiro'
    });
  }
};
