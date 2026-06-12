import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Star, CheckCircle2 } from 'lucide-react'
import { TESTIMONIALS } from '@/lib/constants'
import { SectionHeader } from '@/components/Section'

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={12}
          className={i < rating ? 'text-white fill-white' : 'text-white/20'}
        />
      ))}
    </div>
  )
}

export default function Testimonials() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px 0px' })

  // Split into 3 columns for masonry-like layout
  const col1 = TESTIMONIALS.filter((_, i) => i % 3 === 0)
  const col2 = TESTIMONIALS.filter((_, i) => i % 3 === 1)
  const col3 = TESTIMONIALS.filter((_, i) => i % 3 === 2)

  const renderCard = (testimonial: typeof TESTIMONIALS[0], idx: number) => (
    <motion.div
      key={testimonial.id}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: idx * 0.12 }}
      className="card-glass p-6 mb-3"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="w-9 h-9 rounded-full bg-white/8 border border-white/10 overflow-hidden flex-shrink-0">
            <img
              src={testimonial.avatar}
              alt={testimonial.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                const t = e.target as HTMLImageElement
                t.style.display = 'none'
                const ph = t.nextElementSibling as HTMLElement
                if (ph) ph.style.display = 'flex'
              }}
            />
            <div
              className="hidden w-full h-full items-center justify-center"
              style={{ display: 'none' }}
            >
              <span className="text-white/40 text-xs font-semibold">
                {testimonial.name[0]}
              </span>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-white font-medium text-sm">{testimonial.name}</span>
              {testimonial.verified && (
                <CheckCircle2 size={12} className="text-white/40" />
              )}
            </div>
            <span className="text-[#A3A3A3] text-xs">{testimonial.handle}</span>
          </div>
        </div>
        <StarRating rating={testimonial.rating} />
      </div>

      <p className="text-[#A3A3A3] text-sm leading-relaxed">
        {testimonial.text}
      </p>
    </motion.div>
  )

  return (
    <section className="section-padding bg-[#000000] relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#1A1A1A] to-transparent" />

      <div className="container-site">
        <SectionHeader
          eyebrow="Avaliações"
          title="O que nossos clientes dizem."
          subtitle="Mais de 5 anos construindo histórias de satisfação."
          centered
        />

        {/* Mobile: single column */}
        <div ref={ref} className="md:hidden flex flex-col gap-3">
          {TESTIMONIALS.map((t, i) => renderCard(t, i))}
        </div>

        {/* Desktop: 3 columns */}
        <div className="hidden md:grid md:grid-cols-3 gap-3">
          <div>{col1.map((t, i) => renderCard(t, i * 3))}</div>
          <div className="md:mt-6">{col2.map((t, i) => renderCard(t, i * 3 + 1))}</div>
          <div>{col3.map((t, i) => renderCard(t, i * 3 + 2))}</div>
        </div>
      </div>
    </section>
  )
}
