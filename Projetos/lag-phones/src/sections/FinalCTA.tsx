import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { MessageCircle, Wrench } from 'lucide-react'
import { WHATSAPP_MESSAGES } from '@/lib/constants'

export default function FinalCTA() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px 0px' })

  return (
    <section className="section-padding bg-[#050505] relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#1A1A1A] to-transparent" />

      {/* Background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(255,255,255,0.03), transparent)',
        }}
      />

      <div className="container-site relative">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center max-w-2xl mx-auto"
        >
          <span className="label-eyebrow block mb-6">Pronto para começar?</span>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight tracking-tight mb-6">
            Comprar tecnologia
            nunca foi tão simples.
          </h2>

          <div className="flex flex-col gap-2 mb-10">
            {[
              'Atendimento especializado.',
              'Produtos selecionados.',
              'Confiança comprovada.',
            ].map((item, i) => (
              <motion.p
                key={item}
                initial={{ opacity: 0, y: 10 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.2 + i * 0.07 }}
                className="text-[#A3A3A3] text-base md:text-lg"
              >
                {item}
              </motion.p>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.45 }}
            className="flex flex-col sm:flex-row gap-3 justify-center"
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
        </motion.div>
      </div>
    </section>
  )
}
