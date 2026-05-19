'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { RotatingMesh } from '@/components/3d/RotatingMesh'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: 'easeOut' },
  },
}

export default function HomePage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="relative min-h-screen bg-background overflow-hidden">
      {/* 3D Background - Fixed position */}
      <div className="fixed inset-0 z-0 w-full h-full">
        <Canvas className="!w-full !h-full" camera={{ position: [0, 0, 5], fov: 45 }}>
          <RotatingMesh />
        </Canvas>
      </div>

      {/* Content overlay with higher z-index */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 md:px-6">
        {/* Top Navigation */}
        <motion.nav
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="fixed top-0 left-0 right-0 z-20 flex items-center justify-between px-6 md:px-12 py-8 w-full"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="text-2xl md:text-3xl font-black tracking-tighter text-foreground"
          >
            PHANTOM<span className="text-primary">.</span>
          </motion.div>
          <div className="hidden md:flex gap-8 items-center">
            <motion.div whileHover={{ color: '#65d3ff' }} className="text-sm font-medium">
              <Link href="/mission" className="text-muted-foreground hover:text-accent transition">
                MISSIONS
              </Link>
            </motion.div>
            <motion.div whileHover={{ color: '#65d3ff' }}>
              <Link href="/profile" className="text-sm font-medium text-muted-foreground hover:text-accent transition">
                PROFILE
              </Link>
            </motion.div>
            <motion.div whileHover={{ color: '#65d3ff' }}>
              <Link href="/about" className="text-sm font-medium text-muted-foreground hover:text-accent transition">
                ABOUT
              </Link>
            </motion.div>
          </div>
        </motion.nav>

        {/* Main Content */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center max-w-5xl mx-auto mt-20"
        >
          {/* Label */}
          <motion.div variants={itemVariants} className="mb-8">
            <span className="inline-block text-xs tracking-widest uppercase text-primary font-semibold px-4 py-2 border border-primary/30 rounded-full">
              // CLASSIFIED OPERATION
            </span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            variants={itemVariants}
            className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black text-foreground mb-8 tracking-tighter leading-none"
          >
            PHANTOM
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
              PROTOCOL
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={itemVariants}
            className="text-base md:text-lg text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed font-light"
          >
            An immersive, interactive hacker simulation. Execute covert operations, breach security systems, and navigate the dangerous world of corporate espionage.
          </motion.p>

          {/* Primary CTA Buttons */}
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <motion.div
              whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(107, 114, 255, 0.6)' }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href="/mission"
                className="px-8 md:px-12 py-4 md:py-5 bg-primary hover:bg-primary/90 text-primary-foreground font-black text-lg tracking-wide rounded-lg transition duration-300"
              >
                BEGIN OPERATION
              </Link>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05, borderColor: '#65d3ff' }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href="/terminal"
                className="px-8 md:px-12 py-4 md:py-5 border-2 border-accent text-accent hover:bg-accent/10 font-black text-lg tracking-wide rounded-lg transition duration-300"
              >
                ACCESS TERMINAL
              </Link>
            </motion.div>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-3 gap-4 md:gap-8 mb-16 px-4"
          >
            {[
              { value: '18+', label: 'MISSIONS' },
              { value: '6', label: 'RANKS' },
              { value: '∞', label: 'ENDINGS' },
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.05, y: -5 }}
                className="p-4 md:p-6 rounded-lg border border-foreground/10 hover:border-primary/50 transition"
              >
                <div className="text-3xl md:text-4xl font-black text-primary mb-2">{stat.value}</div>
                <div className="text-xs md:text-sm text-muted-foreground uppercase tracking-wide font-semibold">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Bottom description */}
          <motion.p
            variants={itemVariants}
            className="text-xs md:text-sm text-muted-foreground/70 font-mono max-w-2xl mx-auto mb-12"
          >
            // System Status: OPERATIONAL | Security Level: MAXIMUM | User Clearance: ELITE
          </motion.p>
        </motion.div>

        {/* Creator Attribution - Bottom Right */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="fixed bottom-6 right-6 z-20 text-right"
        >
          <p className="text-xs text-muted-foreground font-mono">
            Built by{' '}
            <motion.a
              href="https://github.com/blodriena"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ color: '#6b72ff', textDecoration: 'underline' }}
              className="text-accent hover:text-primary transition cursor-pointer"
            >
              Toirova Charos
            </motion.a>
          </p>
          <p className="text-xs text-muted-foreground/50 font-mono mt-1">v1.0</p>
        </motion.div>
      </div>
    </div>
  )
}
