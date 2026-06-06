const { createClient } = require('@supabase/supabase-js')
const { verifySignedToken } = require('./validate-token')

function getSupabase() {
  return createClient(
    process.env.SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_KEY || ''
  )
}

module.exports = async function handler(req, res) {
  if (req.method !== 'DELETE') {
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
    const { error } = await supabase
      .from('briefings')
      .delete()
      .eq('id', id)

    if (error) {
      return res.status(500).json({ error: 'Erro ao deletar briefing', details: error.message })
    }

    return res.status(200).json({ success: true, message: 'Briefing deletado com sucesso' })

  } catch (err) {
    return res.status(500).json({ error: 'Erro interno do servidor', details: err.message })
  }
}
