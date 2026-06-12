import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { CATALOG_CATEGORIES, WHATSAPP_MESSAGES } from '@/lib/constants'
import { SectionHeader } from '@/components/Section'

function CatalogCard({
  category,
  index,
  inView,
}: {
  category: typeof CATALOG_CATEGORIES[0]
  index: number
  inView: boolean
}) {
  const whatsappMsg = `${WHATSAPP_MESSAGES.catalog.split('?')[0]}?text=Ol%C3%A1!%20Gostaria%20de%20ver%20os%20modelos%20de%20${encodeURIComponent(category.name)}.`

  return (
    <motion.a
      href={whatsappMsg}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.07, ease: 'easeOut' }}
      className="group relative overflow-hidden rounded-2xl border border-[#1A1A1A] bg-[#0A0A0A] aspect-[4/5] flex flex-col hover:border-white/15 transition-all duration-400 cursor-pointer no-underline"
      style={{ textDecoration: 'none' }}
    >
      {/* Image placeholder area */}
      <div className="flex-1 relative overflow-hidden">
        <div className="absolute inset-0 bg-[#0D0D0D] group-hover:bg-[#111111] transition-colors duration-400">
          {/* Placeholder: replace src with actual product image */}
          <img
            src={category.image}
            alt={category.name}
            className="w-full h-full object-cover opacity-60 group-hover:opacity-80 group-hover:scale-105 transition-all duration-500"
            onError={(e) => {
              const t = e.target as HTMLImageElement
              t.style.display = 'none'
              const ph = t.nextElementSibling as HTMLElement
              if (ph) ph.style.display = 'flex'
            }}
          />
          {/* Image fallback */}
          <div
            className="absolute inset-0 items-center justify-center hidden"
            style={{ display: 'none' }}
          >
            <div className="flex flex-col items-center gap-3 text-center p-6">
              <div className="w-16 h-16 rounded-2xl bg-white/4 border border-white/8 flex items-center justify-center">
                <span className="text-2xl text-white/20">📱</span>
              </div>
              <span className="text-[10px] text-white/20 uppercase tracking-widest">
                {category.name}
              </span>
            </div>
          </div>
        </div>

        {/* Gradient overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'linear-gradient(to top, #0A0A0A 0%, rgba(10,10,10,0.5) 50%, transparent 100%)',
          }}
        />
      </div>

      {/* Content */}
      <div className="p-5 flex items-end justify-between">
        <div>
          <h3 className="font-semibold text-white text-base leading-tight">
            {category.name}
          </h3>
          <p className="text-[#A3A3A3] text-xs mt-1">{category.description}</p>
        </div>
        <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-white/50 group-hover:border-white/30 group-hover:text-white group-hover:bg-white/5 transition-all duration-300 flex-shrink-0">
          <ArrowRight size={13} />
        </div>
      </div>
    </motion.a>
  )
}

export default function Catalog() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px 0px' })

  return (
    <section id="catalogo" className="section-padding bg-[#050505] relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#1A1A1A] to-transparent" />

      <div className="container-site">
        <SectionHeader
          eyebrow="Catálogo"
          title="Tecnologia para cada necessidade."
          subtitle="Produtos originais das melhores marcas. Selecione uma categoria para falar com nosso especialista."
        />

        <div ref={ref} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {CATALOG_CATEGORIES.map((category, i) => (
            <CatalogCard
              key={category.id}
              category={category}
              index={i}
              inView={inView}
            />
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="mt-8 text-center text-[#A3A3A3] text-sm"
        >
          Não encontrou o que procura?{' '}
          <a
            href={WHATSAPP_MESSAGES.consultant}
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:underline"
          >
            Fale com um especialista.
          </a>
        </motion.p>
      </div>
    </section>
  )
}
