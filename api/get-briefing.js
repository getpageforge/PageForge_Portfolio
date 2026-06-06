const { createClient } = require('@supabase/supabase-js')
const { verifySignedToken } = require('./validate-token')

function getSupabase() {
  return createClient(
    process.env.SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_KEY || ''
  )
}

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método não permitido' })
  }

  const token = (req.headers.authorization || '').replace('Bearer ', '')
  const ADMIN_PASSWORD = (process.env.ADMIN_PASSWORD || '').trim()

  if (!token || !ADMIN_PASSWORD || !verifySignedToken(token, ADMIN_PASSWORD)) {
    return res.status(401).json({ error: 'Não autorizado' })
  }

  try {
    const { id } = req.query

    if (!id) {
      return res.status(400).json({ error: 'ID do briefing não fornecido' })
    }

    const supabase = getSupabase()
    const { data, error } = await supabase
      .from('briefings')
      .select('*')
      .eq('id', id)
      .single()

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

  } catch (err) {
    return res.status(500).json({ error: 'Erro interno do servidor', details: err.message })
  }
}
