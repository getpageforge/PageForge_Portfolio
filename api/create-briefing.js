const { createClient } = require('@supabase/supabase-js')

function getSupabase() {
  return createClient(
    process.env.SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_KEY || ''
  )
}

function validateBriefing(data) {
  const errors = []
  if (!data.nome || data.nome.trim() === '') errors.push('Nome é obrigatório')
  if (!data.empresa || data.empresa.trim() === '') errors.push('Empresa é obrigatória')
  if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errors.push('Email inválido')
  if (!data.whatsapp || data.whatsapp.trim() === '') errors.push('WhatsApp é obrigatório')
  return { valid: errors.length === 0, errors }
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' })
  }

  try {
    const { nome, empresa, email, whatsapp, ...respostas } = req.body

    const validation = validateBriefing({ nome, empresa, email, whatsapp })
    if (!validation.valid) {
      return res.status(400).json({ error: 'Dados inválidos', details: validation.errors })
    }

    const supabase = getSupabase()
    const { data, error } = await supabase
      .from('briefings')
      .insert([{ nome: nome.trim(), empresa: empresa.trim(), email: email.trim(), whatsapp: whatsapp.trim(), respostas }])
      .select()

    if (error) {
      return res.status(500).json({ error: 'Erro ao salvar briefing', details: error.message })
    }

    return res.status(201).json({ success: true, message: 'Briefing enviado com sucesso', id: data?.[0]?.id })

  } catch (err) {
    return res.status(500).json({ error: 'Erro interno do servidor', details: err.message })
  }
}