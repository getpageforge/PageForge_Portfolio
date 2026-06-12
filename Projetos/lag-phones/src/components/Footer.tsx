import { Instagram, MessageCircle } from 'lucide-react'
import { WHATSAPP_MESSAGES, INSTAGRAM_URL } from '@/lib/constants'

const FOOTER_LINKS = [
  { label: 'Produtos', href: '#catalogo' },
  { label: 'Assistência', href: '#assistencia' },
  { label: 'Sobre', href: '#sobre' },
  { label: 'Contato', href: '#contato' },
]

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const handleClick = (href: string) => {
    const el = document.querySelector(href)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <footer id="contato" className="border-t border-[#1A1A1A] bg-[#050505]">
      <div className="container-site">
        {/* Main Footer */}
        <div className="py-16 grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="mb-6">
              <img
                src="/images/logo-placeholder.png"
                alt="LAG PHONES"
                className="h-8 w-auto mb-4"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.style.display = 'none'
                  const sibling = target.nextElementSibling as HTMLElement
                  if (sibling) sibling.style.display = 'block'
                }}
              />
              <span className="hidden text-white font-bold text-xl tracking-tight block">
                LAG PHONES
              </span>
            </div>
            <p className="text-[#A3A3A3] text-sm leading-relaxed max-w-xs">
              Tecnologia premium com atendimento que gera confiança. 
              Mais de 5 anos servindo quem busca o melhor.
            </p>
            <div className="mt-6 flex gap-3">
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-[#1A1A1A] flex items-center justify-center text-[#A3A3A3] hover:text-white hover:border-white/20 transition-all duration-200"
                aria-label="Instagram"
              >
                <Instagram size={16} />
              </a>
              <a
                href={WHATSAPP_MESSAGES.consultant}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-[#1A1A1A] flex items-center justify-center text-[#A3A3A3] hover:text-white hover:border-white/20 transition-all duration-200"
                aria-label="WhatsApp"
              >
                <MessageCircle size={16} />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="label-eyebrow mb-5">Navegação</h4>
            <ul className="flex flex-col gap-3">
              {FOOTER_LINKS.map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => handleClick(link.href)}
                    className="text-[#A3A3A3] hover:text-white text-sm transition-colors duration-200 bg-transparent border-none cursor-pointer p-0"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="label-eyebrow mb-5">Atendimento</h4>
            <ul className="flex flex-col gap-3">
              <li>
                <a
                  href={WHATSAPP_MESSAGES.consultant}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#A3A3A3] hover:text-white text-sm transition-colors duration-200"
                >
                  Falar com Consultor
                </a>
              </li>
              <li>
                <a
                  href={WHATSAPP_MESSAGES.assistance}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#A3A3A3] hover:text-white text-sm transition-colors duration-200"
                >
                  Solicitar Assistência
                </a>
              </li>
              <li>
                <a
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#A3A3A3] hover:text-white text-sm transition-colors duration-200"
                >
                  Instagram @lagphones
                </a>
              </li>
            </ul>
            <div className="mt-6 p-4 rounded-xl border border-[#1A1A1A] bg-[#0A0A0A]">
              <p className="text-xs text-[#A3A3A3] mb-1">Horário de atendimento</p>
              <p className="text-sm text-white font-medium">Seg–Sex: 9h às 18h</p>
              <p className="text-sm text-white font-medium">Sáb: 9h às 13h</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="divider" />
        <div className="py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[#A3A3A3] text-xs">
            © {currentYear} LAG PHONES. Todos os direitos reservados.
          </p>
          <p className="text-[#A3A3A3] text-xs">
            221k+ seguidores · 5 anos de mercado · Produtos originais
          </p>
        </div>
      </div>
    </footer>
  )
}
