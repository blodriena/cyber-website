'use client'

import Link from 'next/link'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background p-8 md:p-12">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="text-neon-cyan hover:text-accent transition-colors mb-6 inline-block">
          ← RETURN TO BASE
        </Link>

        <h1 className="text-5xl font-bold mb-8">
          PHANTOM <span className="text-neon-cyan">PROTOCOL</span>
        </h1>

        <div className="space-y-6 text-muted-foreground leading-relaxed">
          <section>
            <h2 className="text-2xl font-bold text-neon-cyan mb-3">WHAT IS PHANTOM PROTOCOL?</h2>
            <p>
              PHANTOM PROTOCOL is an immersive, cinematic hacker simulation experience. Step into the role of an elite operative conducting classified missions through interactive terminal interfaces, branching narratives, and consequence-driven gameplay.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-neon-cyan mb-3">GAMEPLAY</h2>
            <p>
              Navigate the digital underworld through a sophisticated terminal-based interface. Execute reconnaissance, infiltration, extraction, defense, and sabotage missions. Your choices matter—consequences ripple across the narrative, affecting story progression and character relationships.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-neon-cyan mb-3">SYSTEMS</h2>
            <p>
              The game features an intelligent pressure system that tracks your threat level throughout missions. Escalating tension, realistic network infiltration mechanics, and dynamic story branching create a living, breathing hacker universe.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-neon-cyan mb-3">CREATED BY</h2>
            <p>
              Built by <span className="text-accent font-bold">Toirova Charos</span>
            </p>
            <p className="text-sm">
              GitHub: <a href="https://github.com/blodriena" target="_blank" rel="noopener noreferrer" className="text-neon-cyan hover:text-accent">github.com/blodriena</a>
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-neon-cyan mb-3">FEATURES</h2>
            <ul className="space-y-2">
              <li className="flex items-start gap-3">
                <span className="text-accent">▪</span>
                <span>18+ branching missions across 5 categories</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-accent">▪</span>
                <span>Dynamic threat/pressure system with escalating tension</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-accent">▪</span>
                <span>Rich story with 4 main characters and multiple endings</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-accent">▪</span>
                <span>Terminal-based gameplay with realistic hacking mechanics</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-accent">▪</span>
                <span>Consequence-driven narrative with branching storylines</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-accent">▪</span>
                <span>Player progression system with ranks and achievements</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-accent">▪</span>
                <span>Cinematic atmosphere with glitch effects and ambient audio</span>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-neon-cyan mb-3">TECHNOLOGY</h2>
            <p className="text-xs text-muted-foreground">
              Built with Next.js 16, React 19, TypeScript, GSAP, Three.js, Tailwind CSS, and a modular game engine architecture designed for scalability and future expansion into a full multiplayer platform.
            </p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-neon-cyan/20">
          <Link href="/mission" className="inline-block px-6 py-3 bg-neon-cyan text-background font-bold rounded hover:shadow-lg hover:shadow-neon-cyan/50 transition-all">
            START MISSIONS
          </Link>
        </div>
      </div>

      {/* Scanline overlay */}
      <div className="scanline-overlay fixed inset-0 pointer-events-none" />
    </div>
  )
}
