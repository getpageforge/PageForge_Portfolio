import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { ArrowRight, Repeat2, TrendingUp, Search, Star } from 'lucide-react'
import { WHATSAPP_MESSAGES } from '@/lib/constants'
import { SectionHeader } from '@/components/Section'

const CONSULTANT_CARDS = [
  {
    icon: Repeat2,
    title: 'Troca de aparelho',
    description: 'Está pensando em trocar? Te ajudamos a escolher o modelo certo e ainda avaliamos seu usado.',
  },
  {
    icon: TrendingUp,
    title: 'Upgrade de iPhone',
    description: 'Descubra qual versão do iPhone faz mais sentido para o seu uso e orçamento.',
  },
  {
    icon: Search,
    title: 'Avaliação de usado',
    description: 'Antes de comprar um seminovo de outra pessoa, passe conosco para garantir que o aparelho é legítimo.',
  },
  {
    icon: Star,
    title: 'Primeira compra Apple',
    description: 'Nunca teve um iPhone? Vamos encontrar a entrada perfeita no ecossistema Apple para o seu perfil.',
  },
]

export default function Consultor() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px 0px' })

  return (
    <section id="consultor" className="section-padding bg-[#050505] relative">
      {/* Subtle top border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#1A1A1A] to-transparent" />

      <div className="container-site">
        <SectionHeader
          eyebrow="Consultor Online"
          title="Consultor de Smartphone Online"
          subtitle="Receba ajuda especializada para encontrar o aparelho ideal para o seu perfil."
        />

        <div ref={ref} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {CONSULTANT_CARDS.map((card, i) => {
            const Icon = card.icon
            return (
              <motion.a
                key={card.title}
                href={WHATSAPP_MESSAGES.consultant}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.09, ease: 'easeOut' }}
                className="card-glass p-6 flex flex-col gap-4 group cursor-pointer no-underline"
                style={{ textDecoration: 'none' }}
              >
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/8 flex items-center justify-center text-white group-hover:bg-white/10 transition-colors duration-300">
                  <Icon size={18} strokeWidth={1.5} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-white text-base mb-2 leading-tight">
                    {card.title}
                  </h3>
                  <p className="text-[#A3A3A3] text-sm leading-relaxed">
                    {card.description}
                  </p>
                </div>
                <div className="flex items-center gap-1 text-[#A3A3A3] text-xs group-hover:text-white transition-colors duration-200">
                  <span>Falar agora</span>
                  <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform duration-200" />
                </div>
              </motion.a>
            )
          })}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.45 }}
          className="mt-10 text-center"
        >
          <a
            href={WHATSAPP_MESSAGES.consultant}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary inline-flex"
          >
            Falar com Especialista
            <ArrowRight size={16} />
          </a>
        </motion.div>
      </div>
    </section>
  )
}
