import { useEffect } from 'react'
import Lenis from 'lenis'

let lenisInstance: Lenis | null = null

export function useLenis() {
  useEffect(() => {
    lenisInstance = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    })

    function raf(time: number) {
      lenisInstance?.raf(time)
      requestAnimationFrame(raf)
    }

    const rafId = requestAnimationFrame(raf)

    return () => {
      cancelAnimationFrame(rafId)
      lenisInstance?.destroy()
      lenisInstance = null
    }
  }, [])

  return lenisInstance
}

export { lenisInstance }
