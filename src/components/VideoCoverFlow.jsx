// Adapted from opc8838-hub/cover-flow-showcase (MIT).
// See third-party/cover-flow-showcase-LICENSE.txt for the original license.
import { useEffect, useRef, useState } from 'react'
import './VideoCoverFlow.css'

const clamp = (n, min, max) => Math.max(min, Math.min(max, n))

export default function VideoCoverFlow({ items, onSelect, paused = false }) {
  const stageRef = useRef(null)
  const cardRefs = useRef([])
  const navigateRef = useRef(() => {})
  const suppressedRef = useRef(false)
  const pausedRef = useRef(paused)
  pausedRef.current = paused
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const stage = stageRef.current
    if (!stage || !items.length) return undefined
    const total = items.length
    const wrap = value => ((value % total) + total) % total
    const offset = (index, position) => wrap(index - position + total / 2) - total / 2
    let position = 0, target = 0, selected = 0, raf = 0, timer = 0, lastTime = 0
    let lastX = null, pointer = { x: 0, y: 0 }, drag = null
    let visible = false
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')

    const styleCards = () => {
      const compact = stage.clientWidth < 700
      cardRefs.current.forEach((card, index) => {
        if (!card) return
        const distance = offset(index, position)
        const side = distance < 0 ? -1 : 1
        const abs = Math.abs(distance)
        const progress = Math.min(abs, 1)
        const ease = 1 - progress
        const breathe = ease * ease * (3 - 2 * ease)
        const first = compact ? 245 : 450
        const spacing = compact ? 104 : 175
        const x = side * (abs < 1 ? abs * first : first + (abs - 1) * spacing)
        const rotation = side * -62 * Math.pow(progress, 1.65)
        const scale = .835 + breathe * .255 - Math.max(0, abs - 1) * .026
        card.style.transform = `translate3d(${x + pointer.x * 18}px, ${abs * 6 + pointer.y * 8}px, ${190 - abs * 54}px) rotateY(${rotation + pointer.x * -2}deg) scale(${scale})`
        card.style.zIndex = String(60 - Math.round(abs))
        card.style.opacity = String(Math.max(.26, 1 - abs * .085))
      })
      const nextIndex = wrap(Math.round(position))
      if (selected !== nextIndex) { selected = nextIndex; setActiveIndex(nextIndex) }
    }
    const cancelMotion = () => { cancelAnimationFrame(raf); raf = 0; clearTimeout(timer) }
    const animate = now => {
      const dt = lastTime ? Math.min(now - lastTime, 50) : 16.67
      lastTime = now
      const delta = offset(target, position)
      if (Math.abs(delta) < .002 || reducedMotion.matches) {
        position = wrap(target); styleCards(); raf = 0; return
      }
      // Original 0.145 settling rate, normalized for different screen refresh rates.
      position = wrap(position + delta * (1 - Math.pow(1 - .145, dt / 16.67)))
      styleCards()
      raf = requestAnimationFrame(animate)
    }
    const navigate = index => {
      cancelMotion(); target = wrap(index); lastTime = 0
      raf = requestAnimationFrame(animate)
    }
    navigateRef.current = navigate
    const settle = delay => {
      clearTimeout(timer)
      timer = setTimeout(() => navigate(Math.round(position)), delay)
    }
    const push = delta => {
      cancelMotion(); position = wrap(position + delta); target = position; styleCards()
    }
    const wheel = event => {
      if (pausedRef.current || event.ctrlKey) return
      event.preventDefault()
      const delta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY
      const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? stage.clientHeight : 1
      push(clamp(delta * unit, -240, 240) / 230)
      settle(170)
    }
    const pointerMove = event => {
      if (pausedRef.current || (!drag && event.pointerType !== 'mouse')) return
      const rect = stage.getBoundingClientRect()
      pointer = reducedMotion.matches ? { x: 0, y: 0 } : {
        x: clamp((event.clientX - rect.left) / rect.width * 2 - 1, -1, 1),
        y: clamp((event.clientY - rect.top) / rect.height * 2 - 1, -1, 1),
      }
      if (lastX !== null) {
        const dx = event.clientX - lastX
        if (drag) {
          drag.distance += Math.abs(dx)
          if (drag.distance > 6) {
            suppressedRef.current = true
            if (!stage.hasPointerCapture(event.pointerId)) stage.setPointerCapture(event.pointerId)
          }
        }
        if (Math.abs(dx) > .4) { push(-dx / 165); if (!drag) settle(130) }
      }
      lastX = event.clientX
      styleCards()
    }
    const pointerDown = event => {
      if (pausedRef.current || !event.isPrimary || event.button !== 0) return
      drag = { id: event.pointerId, distance: 0 }
      lastX = event.clientX; suppressedRef.current = false
    }
    const pointerUp = event => {
      if (!drag || event.pointerId !== drag.id) return
      drag = null; lastX = null; settle(60)
      if (stage.hasPointerCapture(event.pointerId)) stage.releasePointerCapture(event.pointerId)
    }
    const pointerLeave = () => {
      if (drag) return
      lastX = null; pointer = { x: 0, y: 0 }; styleCards(); settle(60)
    }
    const pauseVideos = () => cardRefs.current.forEach(card => card?.querySelector('video')?.pause())
    const updatePlayback = () => {
      cardRefs.current.forEach((card, index) => {
        const video = card?.querySelector('video')
        if (!video) return
        if (index === selected && visible && !pausedRef.current && !document.hidden) video.play().catch(() => {})
        else video.pause()
      })
    }
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; updatePlayback() })
    observer.observe(stage)
    const resize = new ResizeObserver(styleCards)
    resize.observe(stage)
    stage.addEventListener('wheel', wheel, { passive: false })
    stage.addEventListener('pointermove', pointerMove)
    stage.addEventListener('pointerdown', pointerDown)
    stage.addEventListener('pointerup', pointerUp)
    stage.addEventListener('pointercancel', pointerUp)
    stage.addEventListener('pointerleave', pointerLeave)
    stage.addEventListener('lostpointercapture', pointerUp)
    document.addEventListener('visibilitychange', updatePlayback)
    styleCards(); setActiveIndex(0)
    return () => {
      cancelMotion(); observer.disconnect(); resize.disconnect(); pauseVideos()
      stage.removeEventListener('wheel', wheel)
      stage.removeEventListener('pointermove', pointerMove)
      stage.removeEventListener('pointerdown', pointerDown)
      stage.removeEventListener('pointerup', pointerUp)
      stage.removeEventListener('pointercancel', pointerUp)
      stage.removeEventListener('pointerleave', pointerLeave)
      stage.removeEventListener('lostpointercapture', pointerUp)
      document.removeEventListener('visibilitychange', updatePlayback)
    }
  }, [items])

  useEffect(() => {
    cardRefs.current.forEach((card, index) => {
      const video = card?.querySelector('video')
      if (!video) return
      if (index === activeIndex && !paused && !document.hidden) {
        const rect = stageRef.current.getBoundingClientRect()
        if (rect.bottom > 0 && rect.top < window.innerHeight) video.play().catch(() => {})
      } else video.pause()
    })
  }, [activeIndex, paused])

  return <div className="video-cover-flow">
    <div className="video-cover-flow__stage" ref={stageRef} role="region" tabIndex={0}
      aria-label="视频封面流，可用滚轮或左右方向键切换"
      onKeyDown={event => {
        if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
          event.preventDefault(); navigateRef.current(activeIndex + (event.key === 'ArrowRight' ? 1 : -1))
        }
        if (event.key === 'Enter' && event.target === event.currentTarget) onSelect(items[activeIndex], activeIndex)
      }}>
      <div className="video-cover-flow__ambience" aria-hidden="true" />
      <div className="video-cover-flow__cards">
        {items.map((item, index) => <button type="button" className={`video-cover-card ${index === activeIndex ? 'is-center' : ''}`}
          key={`${item.src}-${index}`} ref={node => { cardRefs.current[index] = node }}
          aria-label={`${index === activeIndex ? '播放' : '居中展示'} ${item.title}`} aria-current={index === activeIndex ? 'true' : undefined}
          onClick={() => {
            if (suppressedRef.current) { suppressedRef.current = false; return }
            if (index === activeIndex) onSelect(item, index)
            else navigateRef.current(index)
          }}>
          <span className="video-cover-card__reflection" style={{ backgroundImage: `url("${item.poster}")` }} aria-hidden="true" />
          <span className="video-cover-card__face">
            <video src={item.src} poster={item.poster} muted loop playsInline preload="metadata" />
            <span className="video-cover-card__shine" />
            <span className="video-cover-card__caption"><small>{item.eyebrow || 'VISUAL SHOWCASE'}</small><strong>{item.title}</strong><span className="video-cover-card__play" aria-hidden="true">▶</span></span>
          </span>
        </button>)}
      </div>
    </div>
    <div className="video-cover-flow__controls">
      <button type="button" onClick={() => navigateRef.current(activeIndex - 1)} aria-label="上一个视频">←</button>
      <div className="video-cover-flow__dots" aria-label="选择视频">
        {items.map((item, index) => <button type="button" key={item.src} aria-label={`切换到 ${item.title}`}
          aria-current={activeIndex === index ? 'true' : undefined} onClick={() => navigateRef.current(index)} />)}
      </div>
      <button type="button" onClick={() => navigateRef.current(activeIndex + 1)} aria-label="下一个视频">→</button>
    </div>
  </div>
}
