import { useEffect, useRef, useState } from 'react'

interface CounterOptions {
  end: number
  duration?: number
  prefix?: string
  suffix?: string
}

export function useCounter({ end, duration = 2000, prefix = '', suffix = '' }: CounterOptions) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLElement>(null)
  const hasStarted = useRef(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted.current) {
          hasStarted.current = true
          let startTime: number
          const startValue = 0
          const endValue = end

          function animate(timestamp: number) {
            if (!startTime) startTime = timestamp
            const progress = Math.min((timestamp - startTime) / duration, 1)
            const eased = 1 - Math.pow(1 - progress, 3)
            setCount(Math.round(startValue + (endValue - startValue) * eased))

            if (progress < 1) {
              requestAnimationFrame(animate)
            }
          }

          requestAnimationFrame(animate)
          observer.disconnect()
        }
      },
      { threshold: 0.3 }
    )

    if (ref.current) observer.observe(ref.current)

    return () => observer.disconnect()
  }, [end, duration])

  return { count: `${prefix}${count.toLocaleString('pt-BR')}${suffix}`, ref }
}
