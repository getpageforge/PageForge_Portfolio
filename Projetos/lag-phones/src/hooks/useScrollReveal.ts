import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface RevealOptions {
  y?: number
  opacity?: number
  duration?: number
  stagger?: number
  delay?: number
}

export function useScrollReveal(options: RevealOptions = {}) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const {
      y = 40,
      opacity = 0,
      duration = 0.8,
      delay = 0,
    } = options

    gsap.fromTo(
      el,
      { y, opacity },
      {
        y: 0,
        opacity: 1,
        duration,
        delay,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          once: true,
        },
      }
    )

    return () => {
      ScrollTrigger.getAll().forEach(st => {
        if (st.trigger === el) st.kill()
      })
    }
  }, [options.y, options.opacity, options.duration, options.delay])

  return ref
}

export function useStaggerReveal(stagger = 0.1, options: RevealOptions = {}) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const children = Array.from(el.children)
    const { y = 40, opacity = 0, duration = 0.7 } = options

    gsap.fromTo(
      children,
      { y, opacity },
      {
        y: 0,
        opacity: 1,
        duration,
        stagger,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          once: true,
        },
      }
    )

    return () => {
      ScrollTrigger.getAll().forEach(st => {
        if (st.trigger === el) st.kill()
      })
    }
  }, [stagger, options.y, options.opacity, options.duration])

  return ref
}
