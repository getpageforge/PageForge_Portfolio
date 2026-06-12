import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Monitor, Battery, ScanFace, Cpu, Watch, Search, ArrowRight } from 'lucide-react'
import { REPAIR_SERVICES, WHATSAPP_MESSAGES } from '@/lib/constants'
import { SectionHeader } from '@/components/Section'

const ICON_MAP: Record<string, React.ElementType> = {
  monitor: Monitor,
  battery: Battery,
  'scan-face': ScanFace,
  cpu: Cpu,
  watch: Watch,
  search: Search,
}

export default function Assistencia() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px 0px' })

  return (
    <section id="assistencia" className="section-padding bg-[#000000] relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#1A1A1A] to-transparent" />

      {/* Subtle background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 60% 40% at 50% 0%, rgba(255,255,255,0.025), transparent)',
        }}
      />

      <div className="container-site relative">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left: Header + CTA */}
          <div>
            <SectionHeader
              eyebrow="Assistência Técnica"
              title="Especialistas em recuperação de dispositivos."
              subtitle="Laboratório próprio com equipamentos de ponta. Cada reparo é realizado com peças originais e garantia."
            />

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-3"
            >
              <a
                href={WHATSAPP_MESSAGES.assistance}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
              >
                Solicitar Orçamento
                <ArrowRight size={15} />
              </a>
            </motion.div>

            {/* Image placeholder */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="mt-8 rounded-2xl overflow-hidden border border-[#1A1A1A] aspect-video bg-[#0A0A0A] flex items-center justify-center"
            >
              {/* Replace with actual image: /images/assistencia/lab-placeholder.jpg */}
              <img
                src="/images/assistencia/lab-placeholder.jpg"
                alt="Laboratório de assistência técnica"
                className="w-full h-full object-cover"
                onError={(e) => {
                  const t = e.target as HTMLImageElement
                  t.style.display = 'none'
                  const ph = t.nextElementSibling as HTMLElement
                  if (ph) ph.style.display = 'flex'
                }}
              />
              <div
                className="hidden w-full h-full items-center justify-center flex-col gap-3 p-8 text-center"
                style={{ display: 'none' }}
              >
                <Cpu size={32} className="text-white/15" />
                <span className="text-white/20 text-xs uppercase tracking-widest">
                  Imagem do laboratório
                </span>
                <span className="text-white/10 text-xs">
                  /images/assistencia/lab-placeholder.jpg
                </span>
              </div>
            </motion.div>
          </div>

          {/* Right: Services grid */}
          <div ref={ref} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {REPAIR_SERVICES.map((service, i) => {
              const Icon = ICON_MAP[service.icon] || Monitor
              return (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 25 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.45, delay: i * 0.08, ease: 'easeOut' }}
                  className="card-glass p-5 group"
                >
                  <div className="w-9 h-9 rounded-xl bg-white/4 border border-white/8 flex items-center justify-center text-white/70 mb-4 group-hover:bg-white/8 transition-colors">
                    <Icon size={16} strokeWidth={1.5} />
                  </div>
                  <h3 className="font-semibold text-white text-sm mb-1.5">
                    {service.name}
                  </h3>
                  <p className="text-[#A3A3A3] text-xs leading-relaxed">
                    {service.description}
                  </p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
