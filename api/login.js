const crypto = require('crypto')

module.exports = async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' })
  }

  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  try {
    const { senha } = req.body

    if (!senha || typeof senha !== 'string' || senha.trim() === '') {
      return res.status(400).json({ error: 'Senha não fornecida' })
    }

    const ADMIN_PASSWORD = (process.env.ADMIN_PASSWORD || '').trim()

    if (!ADMIN_PASSWORD) {
      return res.status(500).json({ error: 'Erro na configuração do servidor' })
    }

    if (senha.trim() !== ADMIN_PASSWORD) {
      return res.status(401).json({ error: 'Senha incorreta' })
    }

    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000)

    const payloadStr = JSON.stringify({ role: 'admin', exp: expiresAt.getTime() })
    const payloadB64 = Buffer.from(payloadStr).toString('base64url')
    const hmac = crypto.createHmac('sha256', ADMIN_PASSWORD)
    hmac.update(payloadB64)
    const signature = hmac.digest('base64url')
    const token = `${payloadB64}.${signature}`

    return res.status(200).json({
      success: true,
      message: 'Login realizado com sucesso',
      token: token,
      expiresAt: expiresAt.toISOString()
    })

  } catch (err) {
    return res.status(500).json({ error: 'Erro interno do servidor', details: err.message })
  }
}
