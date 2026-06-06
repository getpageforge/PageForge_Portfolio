import { createClient } from '@supabase/supabase-js'

// Carregar variáveis de ambiente localmente
if (process.env.NODE_ENV !== 'production') {
  try {
    await import('dotenv/config.js')
  } catch (e) {
    console.warn('dotenv não disponível')
  }
}

const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_KEY || ''
)

// Validar campos básicos obrigatórios
function validateBriefing(data) {
  const errors = []
  
  if (!data.nome || typeof data.nome !== 'string' || data.nome.trim() === '') {
    errors.push('Nome é obrigatório')
  }
  
  if (!data.empresa || typeof data.empresa !== 'string' || data.empresa.trim() === '') {
    errors.push('Empresa é obrigatória')
  }
  
  if (!data.email || typeof data.email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push('Email inválido')
  }
  
  if (!data.whatsapp || typeof data.whatsapp !== 'string' || data.whatsapp.trim() === '') {
    errors.push('WhatsApp é obrigatório')
  }
  
  return {
    valid: errors.length === 0,
    errors
  }
}

export default async function handler(req, res) {
  // Apenas POST é permitido
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' })
  }

  try {
    const { nome, empresa, email, whatsapp, ...respostas } = req.body

    // Validar dados básicos
    const validation = validateBriefing({ nome, empresa, email, whatsapp })
    if (!validation.valid) {
      return res.status(400).json({
        error: 'Dados inválidos',
        details: validation.errors
      })
    }

    // Salvar no Supabase
    const { data, error } = await supabase
      .from('briefings')
      .insert([
        {
          nome: nome.trim(),
          empresa: empresa.trim(),
          email: email.trim(),
          whatsapp: whatsapp.trim(),
          respostas: respostas // Todas as outras respostas em JSON
        }
      ])
      .select()

    if (error) {
      console.error('Erro ao inserir briefing:', error)
      return res.status(500).json({
        error: 'Erro ao salvar briefing',
        details: error.message
      })
    }

    // Sucesso
    return res.status(201).json({
      success: true,
      message: 'Briefing enviado com sucesso',
      id: data?.[0]?.id
    })

  } catch (err) {
    console.error('Erro inesperado:', err)
    return res.status(500).json({
      error: 'Erro interno do servidor',
      details: err.message
    })
  }
}