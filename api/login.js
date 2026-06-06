import crypto from 'crypto'

// Carregar variáveis de ambiente
if (process.env.NODE_ENV !== 'production') {
  try {
    await import('dotenv/config.js')
  } catch (e) {
    console.warn('dotenv não disponível em ambiente de produção')
  }
}

// Gera um token simulando JWT (payload + assinatura)
function generateSignedToken(payload, secret) {
  const payloadStr = JSON.stringify(payload)
  const payloadB64 = Buffer.from(payloadStr).toString('base64url')
  
  const hmac = crypto.createHmac('sha256', secret)
  hmac.update(payloadB64)
  const signature = hmac.digest('base64url')
  
  return `${payloadB64}.${signature}`
}

export default async function handler(req, res) {
  // Apenas POST é permitido
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' })
  }

  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  res.setHeader('Access-Control-Allow-Credentials', 'true')

  try {
    const { senha } = req.body

    if (!senha || typeof senha !== 'string' || senha.trim() === '') {
      return res.status(400).json({ error: 'Senha não fornecida' })
    }

    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD?.trim()

    if (!ADMIN_PASSWORD) {
      console.error('[API LOGIN] ADMIN_PASSWORD não configurada no .env')
      return res.status(500).json({
        error: 'Erro na configuração do servidor'
      })
    }

    if (senha.trim() !== ADMIN_PASSWORD) {
      return res.status(401).json({ error: 'Senha incorreta' })
    }

    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 horas
    
    // Gerar token assinado com a própria ADMIN_PASSWORD
    const tokenPayload = { 
      role: 'admin', 
      exp: expiresAt.getTime() 
    }
    const token = generateSignedToken(tokenPayload, ADMIN_PASSWORD)

    return res.status(200).json({
      success: true,
      message: 'Login realizado com sucesso',
      token: token,
      expiresAt: expiresAt.toISOString()
    })

  } catch (err) {
    console.error('[API LOGIN] Erro inesperado:', err)
    return res.status(500).json({
      error: 'Erro interno do servidor',
      details: err.message
    })
  }
}
