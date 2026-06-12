import { useRef } from 'react'
import { motion } from 'framer-motion'
import { MessageCircle, Wrench, ChevronDown, Instagram } from 'lucide-react'
import { WHATSAPP_MESSAGES } from '@/lib/constants'

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null)

  const scrollToNext = () => {
    const next = document.getElementById('consultor')
    if (next) next.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#000000]"
    >
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Grid pattern */}
        <div className="absolute inset-0 grid-pattern opacity-30" />

        {/* Radial gradient center glow */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 70% 60% at 50% 30%, rgba(255,255,255,0.04) 0%, transparent 70%)',
          }}
        />

        {/* Bottom fade */}
        <div
          className="absolute bottom-0 left-0 right-0 h-40"
          style={{ background: 'linear-gradient(to top, #000000, transparent)' }}
        />
      </div>

      {/* Hero Image Placeholder */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div
          className="relative w-full max-w-2xl mx-auto opacity-20"
          style={{
            background:
              'radial-gradient(ellipse 100% 80% at 50% 50%, rgba(255,255,255,0.06), transparent)',
          }}
        >
          {/* Placeholder for hero image — replace /images/hero/hero-phone.png */}
          <img
            src="/images/hero/hero-phone.png"
            alt="Smartphone premium"
            className="w-full object-contain max-h-[70vh] mx-auto opacity-0"
            style={{ display: 'none' }}
          />
        </div>
      </div>

      {/* Content */}
      <div className="container-site relative z-10 text-center pt-20">
        {/* Back Link */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex justify-center mb-6"
        >
          <a 
            href="../../Structure/index.html#portfolio" 
            className="flex items-center gap-2 text-sm text-[#A3A3A3] hover:text-white transition-colors"
          >
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
              <path d="M9.5 11.5L5.5 7.5l4-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Voltar para serviços
          </a>
        </motion.div>

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex justify-center mb-8"
        >
          <span className="badge">
            <Instagram size={12} />
            221 MIL+ seguidores
          </span>
        </motion.div>

        {/* Headline */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.21, 0.47, 0.32, 0.98] }}
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.08] tracking-tight mb-6">
            Tecnologia premium.
            <br />
            <span className="text-[#A3A3A3] font-light">
              Atendimento que
            </span>
            <br />
            gera confiança.
          </h1>
        </motion.div>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="text-[#A3A3A3] text-base md:text-lg max-w-xl mx-auto leading-relaxed mb-10"
        >
          Apple, Xiaomi, JBL e assistência especializada para quem
          busca comprar com segurança.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="flex flex-col sm:flex-row gap-3 justify-center items-center"
        >
          <a
            href={WHATSAPP_MESSAGES.consultant}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
          >
            <MessageCircle size={16} />
            Falar com Consultor
          </a>
          <a
            href={WHATSAPP_MESSAGES.assistance}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary"
          >
            <Wrench size={16} />
            Solicitar Assistência
          </a>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-16 flex flex-wrap justify-center gap-8 md:gap-12"
        >
          {[
            { value: '221k+', label: 'Seguidores' },
            { value: '5 anos', label: 'de mercado' },
            { value: '100%', label: 'Original' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-xl md:text-2xl font-bold text-white">{stat.value}</div>
              <div className="text-xs text-[#A3A3A3] mt-1">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.button
        onClick={scrollToNext}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer bg-transparent border-none text-[#A3A3A3] hover:text-white transition-colors group"
        aria-label="Rolar para baixo"
      >
        <span className="text-xs tracking-widest uppercase" style={{ fontSize: '10px', letterSpacing: '0.15em' }}>
          Explorar
        </span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown size={18} />
        </motion.div>
      </motion.button>
    </section>
  )
}
