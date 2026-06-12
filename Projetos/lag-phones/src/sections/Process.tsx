import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { PROCESS_STEPS } from '@/lib/constants'
import { SectionHeader } from '@/components/Section'

export default function Process() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px 0px' })

  return (
    <section className="section-padding bg-[#050505] relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#1A1A1A] to-transparent" />

      <div className="container-site">
        <SectionHeader
          eyebrow="Como funciona"
          title="Do contato à entrega, sem complicação."
          centered
        />

        {/* Desktop: horizontal timeline */}
        <div ref={ref} className="hidden md:block relative mt-20">
          {/* Connection line */}
          <div className="absolute top-5 left-0 right-0 h-px bg-[#1A1A1A]" />

          <div className="grid grid-cols-5 gap-4">
            {PROCESS_STEPS.map((step, i) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="flex flex-col items-center text-center"
              >
                {/* Node */}
                <div className="relative z-10 w-10 h-10 rounded-full bg-[#000000] border border-[#1A1A1A] flex items-center justify-center mb-6 group-hover:border-white/20">
                  <span className="text-white font-bold text-xs">{step.number}</span>
                </div>

                {/* Content */}
                <h3 className="font-semibold text-white text-sm mb-2">{step.title}</h3>
                <p className="text-[#A3A3A3] text-xs leading-relaxed">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Mobile: vertical timeline */}
        <div className="md:hidden mt-10 relative">
          <div className="absolute left-5 top-0 bottom-0 w-px bg-[#1A1A1A]" />

          <div className="flex flex-col gap-8">
            {PROCESS_STEPS.map((step, i) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, x: -20 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.45, delay: i * 0.1 }}
                className="flex gap-6 pl-0"
              >
                {/* Node */}
                <div className="relative z-10 w-10 h-10 rounded-full bg-[#000000] border border-[#1A1A1A] flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-xs">{step.number}</span>
                </div>

                {/* Content */}
                <div className="pt-2">
                  <h3 className="font-semibold text-white text-base mb-1">{step.title}</h3>
                  <p className="text-[#A3A3A3] text-sm leading-relaxed">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
