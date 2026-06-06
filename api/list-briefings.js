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
    const { search, limit = 20, offset = 0 } = req.query
    const supabase = getSupabase()

    let query = supabase
      .from('briefings')
      .select('id, nome, empresa, email, created_at', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(Number(offset), Number(offset) + Number(limit) - 1)

    if (search) {
      query = query.or(`nome.ilike.%${search}%,empresa.ilike.%${search}%,email.ilike.%${search}%`)
    }

    const { data, error, count } = await query

    if (error) {
      return res.status(500).json({ error: 'Erro ao buscar briefings', details: error.message })
    }

    return res.status(200).json({ success: true, data: data || [], total: count || 0 })

  } catch (err) {
    return res.status(500).json({ error: 'Erro interno do servidor', details: err.message })
  }
}
