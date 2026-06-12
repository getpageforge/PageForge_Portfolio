import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, MessageCircle } from 'lucide-react'
import { WHATSAPP_MESSAGES, INSTAGRAM_URL } from '@/lib/constants'

const NAV_LINKS = [
  { label: 'Produtos', href: '#catalogo' },
  { label: 'Assistência', href: '#assistencia' },
  { label: 'Sobre', href: '#sobre' },
  { label: 'Contato', href: '#contato' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleNavClick = (href: string) => {
    setMobileOpen(false)
    const el = document.querySelector(href)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <>
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-black/80 backdrop-blur-xl border-b border-white/5'
            : 'bg-transparent'
        }`}
      >
        <div className="container-site">
          <div className="flex items-center justify-between h-16 md:h-18">
            {/* Logo */}
            <a href="/" className="flex items-center gap-2">
              <img
                src="/images/logo-placeholder.png"
                alt="LAG PHONES"
                className="h-8 w-auto"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.style.display = 'none'
                  const sibling = target.nextElementSibling as HTMLElement
                  if (sibling) sibling.style.display = 'block'
                }}
              />
              <span
                className="hidden text-white font-bold text-xl tracking-tight"
                style={{ display: 'block' }}
              >
                LAG PHONES
              </span>
            </a>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-8">
              {NAV_LINKS.map((link) => (
                <button
                  key={link.label}
                  onClick={() => handleNavClick(link.href)}
                  className="text-sm text-[#A3A3A3] hover:text-white transition-colors duration-200 cursor-pointer bg-transparent border-none"
                >
                  {link.label}
                </button>
              ))}
            </nav>

            {/* Desktop CTA */}
            <div className="hidden md:flex items-center gap-3">
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-[#A3A3A3] hover:text-white transition-colors duration-200"
              >
                Instagram
              </a>
              <a
                href={WHATSAPP_MESSAGES.consultant}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary text-sm py-2 px-5"
              >
                <MessageCircle size={15} />
                WhatsApp
              </a>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 text-white bg-transparent border-none cursor-pointer"
              aria-label="Menu"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/95 backdrop-blur-xl flex flex-col pt-20"
          >
            <div className="container-site py-8 flex flex-col gap-2">
              {NAV_LINKS.map((link, i) => (
                <motion.button
                  key={link.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06, duration: 0.3 }}
                  onClick={() => handleNavClick(link.href)}
                  className="text-left text-2xl font-medium text-white py-4 border-b border-white/5 bg-transparent border-t-0 border-l-0 border-r-0 cursor-pointer hover:text-[#A3A3A3] transition-colors"
                >
                  {link.label}
                </motion.button>
              ))}

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-8 flex flex-col gap-3"
              >
                <a
                  href={WHATSAPP_MESSAGES.consultant}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary justify-center"
                  onClick={() => setMobileOpen(false)}
                >
                  <MessageCircle size={16} />
                  Falar com Consultor
                </a>
                <a
                  href={WHATSAPP_MESSAGES.assistance}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary justify-center"
                  onClick={() => setMobileOpen(false)}
                >
                  Solicitar Assistência
                </a>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
