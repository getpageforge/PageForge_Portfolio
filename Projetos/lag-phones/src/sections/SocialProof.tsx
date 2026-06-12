import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { useCounter } from '@/hooks/useCounter'

function StatCard({
  prefix = '',
  end,
  suffix = '',
  label,
  delay,
  inView,
}: {
  prefix?: string
  end: number
  suffix?: string
  label: string
  delay: number
  inView: boolean
}) {
  const { count, ref } = useCounter({
    end,
    prefix,
    suffix,
    duration: 2200,
  })

  return (
    <motion.div
      ref={ref as React.RefObject<HTMLDivElement>}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: 'easeOut' }}
      className="flex flex-col items-center text-center p-8 rounded-2xl border border-[#1A1A1A] bg-[#0A0A0A] hover:border-white/10 transition-colors duration-300"
    >
      <span className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-2">
        {count}
      </span>
      <span className="text-[#A3A3A3] text-sm">{label}</span>
    </motion.div>
  )
}

export default function SocialProof() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px 0px' })

  return (
    <section className="section-padding bg-[#000000] relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#1A1A1A] to-transparent" />

      <div className="container-site">
        <div className="mb-14 text-center">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="label-eyebrow block mb-4"
          >
            Prova Social
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight tracking-tight"
          >
            A confiança de milhares
            <br />
            de clientes.
          </motion.h2>
        </div>

        <div ref={ref} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            end={221}
            suffix="k+"
            label="Seguidores"
            delay={0}
            inView={inView}
          />
          <StatCard
            end={5700}
            suffix="+"
            label="Publicações"
            delay={0.1}
            inView={inView}
          />
          <StatCard
            end={5}
            suffix=" Anos+"
            label="de Mercado"
            delay={0.2}
            inView={inView}
          />
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
            className="flex flex-col items-center text-center p-8 rounded-2xl border border-[#1A1A1A] bg-[#0A0A0A] hover:border-white/10 transition-colors duration-300"
          >
            <span className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-2">
              Milhares
            </span>
            <span className="text-[#A3A3A3] text-sm">de clientes atendidos</span>
          </motion.div>
        </div>

        {/* Trust bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="mt-8 p-6 rounded-2xl border border-[#1A1A1A] bg-[#050505] flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12 text-center"
        >
          {[
            'Produtos 100% Originais',
            'Garantia em todos os serviços',
            'Atendimento especializado',
            'Entrega para todo Brasil',
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-white/40" />
              <span className="text-[#A3A3A3] text-sm">{item}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
