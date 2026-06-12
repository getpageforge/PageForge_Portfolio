import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import {
  ShieldCheck,
  BadgeCheck,
  Headset,
  Wrench,
  PackageCheck,
  CreditCard,
} from 'lucide-react'
import { DIFFERENTIALS } from '@/lib/constants'
import { SectionHeader } from '@/components/Section'

const ICON_MAP: Record<string, React.ElementType> = {
  'shield-check': ShieldCheck,
  'badge-check': BadgeCheck,
  headset: Headset,
  wrench: Wrench,
  'package-check': PackageCheck,
  'credit-card': CreditCard,
}

export default function Differentials() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px 0px' })

  return (
    <section className="section-padding bg-[#000000] relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#1A1A1A] to-transparent" />

      <div className="container-site">
        <SectionHeader
          eyebrow="Por que a LAG PHONES"
          title="Por que as pessoas escolhem a LAG PHONES."
          centered
        />

        {/* Bento grid */}
        <div ref={ref} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 auto-rows-[minmax(160px,auto)]">
          {DIFFERENTIALS.map((diff, i) => {
            const Icon = ICON_MAP[diff.icon] || ShieldCheck

            // Large card spans 2 columns
            const isLarge = i === 2
            const colSpan = isLarge ? 'col-span-2 md:col-span-2 lg:col-span-3' : 'col-span-1 lg:col-span-2'

            return (
              <motion.div
                key={diff.title}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.45, delay: i * 0.07 }}
                className={`card-glass p-6 md:p-8 flex flex-col justify-between ${colSpan} ${isLarge ? 'row-span-1' : ''}`}
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-white/4 border border-white/8 flex items-center justify-center text-white/70 mb-4">
                    <Icon size={18} strokeWidth={1.5} />
                  </div>
                  <h3 className={`font-semibold text-white mb-2 leading-tight ${isLarge ? 'text-xl' : 'text-base'}`}>
                    {diff.title}
                  </h3>
                  <p className={`text-[#A3A3A3] leading-relaxed ${isLarge ? 'text-sm md:text-base' : 'text-xs'}`}>
                    {diff.description}
                  </p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
