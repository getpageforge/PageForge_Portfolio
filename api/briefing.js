const { createClient } = require('@supabase/supabase-js')
const { verifySignedToken } = require('./validate-token')

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

function verifyAdmin(req) {
  const token = (req.headers.authorization || '').replace('Bearer ', '')
  const ADMIN_PASSWORD = (process.env.ADMIN_PASSWORD || '').trim()
  return token && ADMIN_PASSWORD && verifySignedToken(token, ADMIN_PASSWORD)
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type')

  if (req.method === 'OPTIONS') return res.status(200).end()

  const supabase = getSupabase()

  try {
    if (req.method === 'POST') {
      const { nome, empresa, email, whatsapp, ...respostas } = req.body
      const validation = validateBriefing({ nome, empresa, email, whatsapp })
      if (!validation.valid) {
        return res.status(400).json({ error: 'Dados inválidos', details: validation.errors })
      }
      const { data, error } = await supabase
        .from('briefings')
        .insert([{ nome: nome.trim(), empresa: empresa.trim(), email: email.trim(), whatsapp: whatsapp.trim(), respostas }])
        .select()
      if (error) return res.status(500).json({ error: 'Erro ao salvar briefing', details: error.message })
      return res.status(201).json({ success: true, message: 'Briefing enviado com sucesso', id: data?.[0]?.id })
    }

    if (!verifyAdmin(req)) return res.status(401).json({ error: 'Não autorizado' })

    if (req.method === 'GET') {
      const { id, search, limit = 20, offset = 0 } = req.query
      if (id) {
        const { data, error } = await supabase.from('briefings').select('*').eq('id', id).single()
        if (error) {
          if (error.code === 'PGRST116') return res.status(404).json({ error: 'Briefing não encontrado' })
          return res.status(500).json({ error: 'Erro ao buscar briefing', details: error.message })
        }
        const briefing = {
          ...data,
          created_at: new Date(data.created_at).toLocaleDateString('pt-BR', {
            day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
          })
        }
        return res.status(200).json({ success: true, data: briefing })
      }
      let query = supabase.from('briefings').select('id, nome, empresa, email, created_at', { count: 'exact' }).order('created_at', { ascending: false }).range(Number(offset), Number(offset) + Number(limit) - 1)
      if (search) query = query.or(`nome.ilike.%${search}%,empresa.ilike.%${search}%,email.ilike.%${search}%`)
      const { data, error, count } = await query
      if (error) return res.status(500).json({ error: 'Erro ao buscar briefings', details: error.message })
      return res.status(200).json({ success: true, data: data || [], total: count || 0 })
    }

    if (req.method === 'DELETE') {
      const { id } = req.query
      if (!id) return res.status(400).json({ error: 'ID do briefing não fornecido' })
      const { error } = await supabase.from('briefings').delete().eq('id', id)
      if (error) return res.status(500).json({ error: 'Erro ao deletar briefing', details: error.message })
      return res.status(200).json({ success: true, message: 'Briefing deletado com sucesso' })
    }

    return res.status(405).json({ error: 'Método não permitido' })
  } catch (err) {
    return res.status(500).json({ error: 'Erro interno do servidor', details: err.message })
  }
}
