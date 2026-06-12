import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { WHATSAPP_MESSAGES, INSTAGRAM_URL } from '@/lib/constants'

export default function About() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px 0px' })

  return (
    <section id="sobre" className="section-padding bg-[#050505] relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#1A1A1A] to-transparent" />

      <div className="container-site">
        <div ref={ref} className="grid lg:grid-cols-2 gap-12 md:gap-20 items-center">
          {/* Left: Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="aspect-square md:aspect-[4/5] rounded-3xl overflow-hidden border border-[#1A1A1A] bg-[#0A0A0A]">
              {/* Replace with actual image: /images/about/store-placeholder.jpg */}
              <img
                src="/images/about/store-placeholder.jpg"
                alt="LAG PHONES — Nossa loja"
                className="w-full h-full object-cover"
                onError={(e) => {
                  const t = e.target as HTMLImageElement
                  t.style.display = 'none'
                  const ph = t.nextElementSibling as HTMLElement
                  if (ph) ph.style.display = 'flex'
                }}
              />
              <div
                className="hidden w-full h-full items-center justify-center flex-col gap-4"
                style={{ display: 'none' }}
              >
                <div className="text-6xl opacity-10">🏪</div>
                <span className="text-white/15 text-xs uppercase tracking-widest text-center px-8">
                  Foto da loja
                  <br />
                  /images/about/store-placeholder.jpg
                </span>
              </div>
            </div>

            {/* Floating badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="absolute -bottom-6 -right-4 md:-right-8 bg-[#0A0A0A] border border-[#1A1A1A] rounded-2xl p-4 md:p-5 shadow-2xl"
            >
              <div className="flex items-center gap-3">
                <div>
                  <div className="text-xl font-bold text-white">5+</div>
                  <div className="text-xs text-[#A3A3A3]">anos de mercado</div>
                </div>
                <div className="w-px h-8 bg-[#1A1A1A]" />
                <div>
                  <div className="text-xl font-bold text-white">221k</div>
                  <div className="text-xs text-[#A3A3A3]">seguidores</div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right: Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-8 lg:mt-0"
          >
            <span className="label-eyebrow block mb-4">Sobre a marca</span>
            <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight tracking-tight mb-6">
              Uma marca construída
              sobre confiança.
            </h2>

            <div className="flex flex-col gap-5 text-[#A3A3A3] text-base leading-relaxed">
              <p>
                A LAG PHONES nasceu da crença de que comprar tecnologia deveria ser uma experiência
                simples, segura e transparente. Começamos pequenos, com o Instagram como vitrine,
                e crescemos até nos tornar uma referência com mais de 221 mil seguidores.
              </p>
              <p>
                Hoje, somos especializados em Apple, Xiaomi e JBL — com produtos 100% originais
                e uma assistência técnica que resolve o que outros não conseguem.
              </p>
              <p>
                Nosso compromisso é simples: tratar cada cliente como queremos ser tratados.
                Sem enrolação, sem surpresas.
              </p>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary"
              >
                Ver no Instagram
                <ArrowRight size={15} />
              </a>
              <a
                href={WHATSAPP_MESSAGES.consultant}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
              >
                Falar Conosco
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
