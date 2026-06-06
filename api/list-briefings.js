import { createClient } from '@supabase/supabase-js'
import { verifySignedToken } from './validate-token.js'

if (process.env.NODE_ENV !== 'production') {
  try { await import('dotenv/config.js') } catch (e) { }
}

const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_KEY || ''
)

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método não permitido' })
  }

  const token = req.headers.authorization?.replace('Bearer ', '')
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD?.trim()

  if (!token || !ADMIN_PASSWORD || !verifySignedToken(token, ADMIN_PASSWORD)) {
    return res.status(401).json({ error: 'Não autorizado' })
  }

  try {
    const { search, limit = 20, offset = 0 } = req.query

    let query = supabase
      .from('briefings')
      .select('id, nome, empresa, email, created_at', { count: 'exact' })
      .order('created_at', { ascending: false })

    // Se houver busca, aplicar filtro por nome ou empresa
    if (search && search.trim()) {
      const searchTerm = search.trim().toLowerCase()
      // Nota: Supabase usa 'ilike' para case-insensitive like
      query = supabase
        .from('briefings')
        .select('id, nome, empresa, email, created_at', { count: 'exact' })
        .or(`nome.ilike.%${searchTerm}%,empresa.ilike.%${searchTerm}%`)
        .order('created_at', { ascending: false })
    }

    // Paginar resultados
    const { data, error, count } = await query
      .range(parseInt(offset), parseInt(offset) + parseInt(limit) - 1)

    if (error) {
      console.error('Erro ao buscar briefings:', error)
      return res.status(500).json({
        error: 'Erro ao buscar briefings',
        details: error.message
      })
    }

    // Formatar data
    const formatted = data.map(item => ({
      ...item,
      created_at: new Date(item.created_at).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }))

    return res.status(200).json({
      success: true,
      data: formatted,
      pagination: {
        total: count,
        limit: parseInt(limit),
        offset: parseInt(offset),
        pages: Math.ceil(count / parseInt(limit))
      }
    })

  } catch (err) {
    console.error('Erro inesperado:', err)
    return res.status(500).json({
      error: 'Erro interno do servidor',
      details: err.message
    })
  }
}
