import { useRef, useEffect, ReactNode } from 'react'
import { motion, useInView, useAnimation } from 'framer-motion'

interface SectionProps {
  children: ReactNode
  id?: string
  className?: string
  delay?: number
}

export default function Section({ children, id, className = '', delay = 0 }: SectionProps) {
  const controls = useAnimation()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px 0px' })

  useEffect(() => {
    if (inView) {
      controls.start('visible')
    }
  }, [controls, inView])

  return (
    <motion.section
      id={id}
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={{
        hidden: { opacity: 0, y: 40 },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.7,
            delay,
            ease: [0.21, 0.47, 0.32, 0.98],
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.section>
  )
}

export function SectionHeader({
  eyebrow,
  title,
  subtitle,
  centered = false,
}: {
  eyebrow?: string
  title: string
  subtitle?: string
  centered?: boolean
}) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px 0px' })

  return (
    <div ref={ref} className={`mb-14 ${centered ? 'text-center' : ''}`}>
      {eyebrow && (
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="label-eyebrow block mb-4"
        >
          {eyebrow}
        </motion.span>
      )}
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.05 }}
        className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight tracking-tight"
      >
        {title}
      </motion.h2>
      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.12 }}
          className={`mt-4 text-[#A3A3A3] text-base md:text-lg leading-relaxed ${centered ? 'mx-auto max-w-2xl' : 'max-w-xl'}`}
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  )
}
