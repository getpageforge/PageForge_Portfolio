import crypto from 'crypto'

// Carregar variáveis de ambiente
if (process.env.NODE_ENV !== 'production') {
  try {
    await import('dotenv/config.js')
  } catch (e) {
    console.warn('dotenv não disponível')
  }
}

export function verifySignedToken(token, secret) {
  try {
    const [payloadB64, signature] = token.split('.')
    if (!payloadB64 || !signature) return null

    const hmac = crypto.createHmac('sha256', secret)
    hmac.update(payloadB64)
    const expectedSignature = hmac.digest('base64url')

    if (signature !== expectedSignature) return null

    const payloadStr = Buffer.from(payloadB64, 'base64url').toString('utf8')
    const payload = JSON.parse(payloadStr)

    // Check expiration
    if (payload.exp && Date.now() > payload.exp) {
      return null
    }

    return payload
  } catch (e) {
    return null
  }
}

export default async function handler(req, res) {
  // Apenas GET e POST são permitidos
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' })
  }

  try {
    const token = req.headers.authorization?.replace('Bearer ', '') || req.query.token

    if (!token) {
      return res.status(401).json({ success: false, error: 'Token não fornecido' })
    }

    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD?.trim()
    if (!ADMIN_PASSWORD) {
      return res.status(500).json({ success: false, error: 'Erro de configuração do servidor' })
    }

    const payload = verifySignedToken(token, ADMIN_PASSWORD)

    if (!payload) {
      return res.status(401).json({ success: false, error: 'Token inválido ou expirado' })
    }

    return res.status(200).json({ success: true, message: 'Token válido', token: token })

  } catch (err) {
    console.error('Erro ao validar token:', err)
    return res.status(500).json({ success: false, error: 'Erro ao validar sessão' })
  }
}
