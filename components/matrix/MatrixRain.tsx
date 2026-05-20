'use client'

import React, { useEffect, useRef } from 'react'

const MatrixRain: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)



  
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    // Matrix characters
    const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン'
    const charArray = chars.split('')
    const fontSize = 14
    const columns = Math.floor(canvas.width / fontSize)

    // Drops array - position of drop for each column
    const drops: number[] = Array(columns).fill(0).map(() => Math.random() * canvas.height)

    // Animation loop
    const animate = () => {
      // Semi-transparent background for trail effect
      ctx.fillStyle = 'rgba(3, 3, 3, 0.05)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.fillStyle = 'rgba(37, 161, 94, 0.8)' // Matrix green
      ctx.font = `${fontSize}px 'JetBrains Mono', monospace`

      for (let i = 0; i < drops.length; i++) {
        const char = charArray[Math.floor(Math.random() * charArray.length)]
        ctx.fillText(char, i * fontSize, drops[i] * fontSize)

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0
        }
        drops[i]++
      }

      requestAnimationFrame(animate)
    }

    animate()

    // Handle window resize
    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full opacity-40 pointer-events-none z-0"
    />
  )
}

export default MatrixRain
