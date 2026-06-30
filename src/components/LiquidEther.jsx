import { useEffect, useRef } from 'react'
import './LiquidEther.css'

export default function LiquidEther({
  colors = ['#5227FF', '#FF9FFC', '#B497CF'],
  autoSpeed = 0.5,
  autoIntensity = 1,
  resolution = 0.6,
  className = '',
  style = {},
}) {
  const rootRef = useRef(null)
  const frameRef = useRef(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    let start = performance.now()
    let visible = true

    const update = (now) => {
      if (!visible) return
      const t = ((now - start) / 1000) * autoSpeed
      root.style.setProperty('--ether-x', `${50 + Math.sin(t * 0.72) * 24 * autoIntensity}%`)
      root.style.setProperty('--ether-y', `${50 + Math.cos(t * 0.54) * 18 * autoIntensity}%`)
      root.style.setProperty('--ether-x2', `${50 + Math.sin(t * 0.42 + 1.9) * 32 * autoIntensity}%`)
      root.style.setProperty('--ether-y2', `${50 + Math.cos(t * 0.66 + 1.2) * 22 * autoIntensity}%`)
      frameRef.current = requestAnimationFrame(update)
    }

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      if (visible && !frameRef.current) {
        start = performance.now() - (performance.now() - start)
        frameRef.current = requestAnimationFrame(update)
      }
      if (!visible && frameRef.current) {
        cancelAnimationFrame(frameRef.current)
        frameRef.current = null
      }
    }, { threshold: 0.01 })

    observer.observe(root)
    frameRef.current = requestAnimationFrame(update)

    return () => {
      observer.disconnect()
      if (frameRef.current) cancelAnimationFrame(frameRef.current)
    }
  }, [autoSpeed, autoIntensity])

  const palette = [...colors, ...colors].slice(0, 6)

  return (
    <div
      ref={rootRef}
      className={`liquid-ether-container ${className}`}
      style={{
        '--ether-resolution': resolution,
        '--ether-c1': palette[0],
        '--ether-c2': palette[1],
        '--ether-c3': palette[2],
        '--ether-c4': palette[3],
        '--ether-c5': palette[4],
        '--ether-c6': palette[5],
        ...style,
      }}
    >
      <span className="ether-field ether-field-a" />
      <span className="ether-field ether-field-b" />
      <span className="ether-field ether-field-c" />
      <span className="ether-vein ether-vein-a" />
      <span className="ether-vein ether-vein-b" />
    </div>
  )
}
