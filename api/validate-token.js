const crypto = require('crypto')

function verifySignedToken(token, secret) {
  try {
    const parts = token.split('.')
    if (parts.length !== 2) return null
    const [payloadB64, signature] = parts

    const hmac = crypto.createHmac('sha256', secret)
    hmac.update(payloadB64)
    const expectedSig = hmac.digest('base64url')

    if (signature !== expectedSig) return null

    const payload = JSON.parse(Buffer.from(payloadB64, 'base64url').toString('utf8'))
    if (payload.exp && Date.now() > payload.exp) return null
    return payload
  } catch (e) {
    return null
  }
}

module.exports = { verifySignedToken }
module.exports.default = async function handler(req, res) {
  const token = (req.headers.authorization || '').replace('Bearer ', '')
  const ADMIN_PASSWORD = (process.env.ADMIN_PASSWORD || '').trim()

  if (!token) return res.status(401).json({ success: false, error: 'Token não fornecido' })
  if (!ADMIN_PASSWORD) return res.status(500).json({ success: false, error: 'Erro de configuração' })

  const payload = verifySignedToken(token, ADMIN_PASSWORD)
  if (!payload) return res.status(401).json({ success: false, error: 'Token inválido ou expirado' })

  return res.status(200).json({ success: true, token })
}
