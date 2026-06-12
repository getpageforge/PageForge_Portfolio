import { useEffect } from 'react'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Components
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

// Sections
import Hero from '@/sections/Hero'
import Consultor from '@/sections/Consultor'
import SocialProof from '@/sections/SocialProof'
import Catalog from '@/sections/Catalog'
import Assistencia from '@/sections/Assistencia'
import Process from '@/sections/Process'
import BeforeAfter from '@/sections/BeforeAfter'
import Upgrade from '@/sections/Upgrade'
import Differentials from '@/sections/Differentials'
import About from '@/sections/About'
import Testimonials from '@/sections/Testimonials'
import FinalCTA from '@/sections/FinalCTA'

gsap.registerPlugin(ScrollTrigger)

export default function App() {
  useEffect(() => {
    // Initialize Lenis smooth scroll
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    })

    // Connect Lenis to GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update)

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000)
    })

    gsap.ticker.lagSmoothing(0)

    return () => {
      lenis.destroy()
      gsap.ticker.remove((time) => {
        lenis.raf(time * 1000)
      })
    }
  }, [])

  return (
    <div className="min-h-screen bg-[#000000] text-white">
      <Navbar />
      <main>
        <Hero />
        <Consultor />
        <SocialProof />
        <Catalog />
        <Assistencia />
        <Process />
        <BeforeAfter />
        <Upgrade />
        <Differentials />
        <About />
        <Testimonials />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  )
}
