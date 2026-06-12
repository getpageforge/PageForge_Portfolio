import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { ArrowRight, Repeat2 } from 'lucide-react'
import { WHATSAPP_MESSAGES } from '@/lib/constants'

export default function Upgrade() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px 0px' })

  return (
    <section className="section-padding bg-[#050505] relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#1A1A1A] to-transparent" />

      <div className="container-site">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="relative rounded-3xl border border-[#1A1A1A] bg-[#0A0A0A] overflow-hidden"
        >
          {/* Background glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'radial-gradient(ellipse 60% 60% at 30% 50%, rgba(255,255,255,0.03), transparent)',
            }}
          />

          <div className="grid md:grid-cols-2 gap-0">
            {/* Left: Content */}
            <div className="p-10 md:p-14 flex flex-col justify-center">
              <div className="mb-6">
                <span className="label-eyebrow block mb-4">Trade-in</span>
                <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight tracking-tight mb-4">
                  Seu próximo aparelho
                  pode custar menos.
                </h2>
                <p className="text-[#A3A3A3] text-base leading-relaxed">
                  Aceitamos seu aparelho atual como parte do pagamento.
                  Avaliação justa, processo transparente e sem burocracia.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href={WHATSAPP_MESSAGES.upgrade}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary"
                >
                  Fazer Upgrade
                  <ArrowRight size={16} />
                </a>
              </div>

              {/* Mini features */}
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  'Avaliação gratuita',
                  'Sem taxa de intermediação',
                  'Processo em minutos',
                  'Melhor preço garantido',
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-white/40 flex-shrink-0" />
                    <span className="text-[#A3A3A3] text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Visual */}
            <div className="relative min-h-[280px] md:min-h-0 border-t md:border-t-0 md:border-l border-[#1A1A1A]">
              {/* Image placeholder: /images/upgrade/trade-in-placeholder.jpg */}
              <img
                src="/images/upgrade/trade-in-placeholder.jpg"
                alt="Trade-in de smartphones"
                className="absolute inset-0 w-full h-full object-cover"
                onError={(e) => {
                  const t = e.target as HTMLImageElement
                  t.style.display = 'none'
                }}
              />

              {/* Fallback visual */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                  <motion.div
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                    className="relative"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-20 h-36 rounded-2xl border border-white/10 bg-white/3 flex items-center justify-center">
                        <span className="text-3xl opacity-30">📱</span>
                      </div>
                      <motion.div
                        animate={{ x: [-4, 4, -4], rotate: [0, 180, 360] }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                      >
                        <Repeat2 size={24} className="text-white/30" />
                      </motion.div>
                      <div className="w-20 h-36 rounded-2xl border border-white/20 bg-white/5 flex items-center justify-center">
                        <span className="text-3xl opacity-50">📱</span>
                      </div>
                    </div>
                  </motion.div>
                  <span className="text-white/20 text-xs uppercase tracking-widest">
                    Trade-in disponível
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
