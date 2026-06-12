import { useRef, useState, useCallback } from 'react'
import { motion, useInView } from 'framer-motion'
import { MoveHorizontal } from 'lucide-react'
import { SectionHeader } from '@/components/Section'

function CompareSlider() {
  const [position, setPosition] = useState(50)
  const containerRef = useRef<HTMLDivElement>(null)
  const isDragging = useRef(false)

  const updatePosition = useCallback((clientX: number) => {
    const container = containerRef.current
    if (!container) return
    const rect = container.getBoundingClientRect()
    const x = clientX - rect.left
    const pct = Math.max(5, Math.min(95, (x / rect.width) * 100))
    setPosition(pct)
  }, [])

  const onMouseDown = () => {
    isDragging.current = true
  }

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return
    updatePosition(e.clientX)
  }

  const onMouseUp = () => {
    isDragging.current = false
  }

  const onTouchMove = (e: React.TouchEvent) => {
    updatePosition(e.touches[0].clientX)
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-[16/9] md:aspect-[21/9] rounded-2xl overflow-hidden border border-[#1A1A1A] cursor-col-resize select-none"
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
      onTouchMove={onTouchMove}
    >
      {/* AFTER image (right side — full) */}
      <div className="absolute inset-0 bg-[#0A0A0A]">
        {/* Replace with actual "after" image: /images/before-after/after-placeholder.jpg */}
        <img
          src="/images/before-after/after-placeholder.jpg"
          alt="Depois do reparo"
          className="w-full h-full object-cover"
          onError={(e) => {
            const t = e.target as HTMLImageElement
            t.style.display = 'none'
          }}
        />
        {/* Fallback */}
        <div className="absolute inset-0 flex items-center justify-end pr-12 pointer-events-none">
          <div className="text-center">
            <div className="text-4xl mb-3">✨</div>
            <span className="text-white/20 text-xs uppercase tracking-widest">Depois</span>
          </div>
        </div>
        <div className="absolute bottom-4 right-4 badge">Depois</div>
      </div>

      {/* BEFORE image (left side — clipped) */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ width: `${position}%` }}
      >
        <div className="absolute inset-0 bg-[#111111]" style={{ width: '100vw' }}>
          {/* Replace with actual "before" image: /images/before-after/before-placeholder.jpg */}
          <img
            src="/images/before-after/before-placeholder.jpg"
            alt="Antes do reparo"
            className="h-full object-cover"
            style={{ width: containerRef.current?.offsetWidth || 800 }}
            onError={(e) => {
              const t = e.target as HTMLImageElement
              t.style.display = 'none'
            }}
          />
          {/* Fallback */}
          <div className="absolute inset-0 flex items-center justify-start pl-12 pointer-events-none">
            <div className="text-center">
              <div className="text-4xl mb-3">📱</div>
              <span className="text-white/20 text-xs uppercase tracking-widest">Antes</span>
            </div>
          </div>
          <div className="absolute bottom-4 left-4 badge">Antes</div>
        </div>
      </div>

      {/* Divider handle */}
      <div
        className="absolute top-0 bottom-0 z-20 flex items-center justify-center"
        style={{ left: `${position}%`, transform: 'translateX(-50%)' }}
        onMouseDown={onMouseDown}
        onTouchStart={() => { isDragging.current = true }}
        onTouchEnd={() => { isDragging.current = false }}
      >
        {/* Line */}
        <div className="absolute top-0 bottom-0 w-px bg-white/30" />

        {/* Handle */}
        <div className="relative z-10 w-9 h-9 rounded-full bg-white shadow-xl flex items-center justify-center cursor-grab active:cursor-grabbing">
          <MoveHorizontal size={16} className="text-black" />
        </div>
      </div>
    </div>
  )
}

export default function BeforeAfter() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px 0px' })

  return (
    <section className="section-padding bg-[#000000] relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#1A1A1A] to-transparent" />

      <div className="container-site">
        <SectionHeader
          eyebrow="Resultados"
          title="O resultado fala por si."
          subtitle="Arraste para comparar o antes e depois dos nossos reparos."
          centered
        />

        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <CompareSlider />
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-4 text-center text-[#A3A3A3] text-xs"
        >
          Arraste o slider para comparar · Imagens reais dos nossos serviços
        </motion.p>
      </div>
    </section>
  )
}
