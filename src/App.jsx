import { useEffect, useState } from 'react'
import BorderGlow from './components/BorderGlow'
import MagicRings from './components/MagicRings'
import ColorBends from './components/ColorBends'
import SoftAurora from './components/SoftAurora'
import LiquidEther from './components/LiquidEther'

const Arrow = ({ diagonal = false }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d={diagonal ? 'M7 17 17 7M8 7h9v9' : 'M5 12h14m-5-5 5 5-5 5'} />
  </svg>
)

const ToolbarIcon = ({ type }) => {
  const paths = {
    home: 'M4 11.5 12 4l8 7.5M6.5 10v9h4.2v-5h2.6v5h4.2v-9',
    move: 'M12 3v18M3 12h18M12 3 9 6m3-3 3 3M21 12l-3-3m3 3-3 3M12 21l-3-3m3 3 3-3M3 12l3-3m-3 3 3 3',
    bounds: 'M5 5h4M5 5v4m14-4h-4m4 0v4M5 19h4m-4 0v-4m14 4h-4m4 0v-4',
    alignLeft: 'M6 5v14m3-11h9m-9 4h6m-6 4h10',
    alignCenter: 'M12 4v16M6 8h12m-9 4h6m-8 4h10',
    alignRight: 'M18 5v14M6 8h9m-6 4h6m-10 4h10',
  }
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d={paths[type] || paths.bounds} /></svg>
}

const PhotoshopBar = () => (
  <div className="hero-psbar" aria-hidden="true">
    <span className="ps-icon"><ToolbarIcon type="home" /></span>
    <span className="ps-icon move"><ToolbarIcon type="move" /></span>
    <span className="ps-chevron">⌄</span>
    <span className="ps-check">✓</span>
    <span className="ps-label">Auto-Select:</span>
    <span className="ps-select">Layer <b>⌄</b></span>
    <span className="ps-check">✓</span>
    <span className="ps-label transform-label">Show Transform Controls</span>
    <i className="ps-divider" />
    <span className="ps-icon"><ToolbarIcon type="alignLeft" /></span>
    <span className="ps-icon"><ToolbarIcon type="alignCenter" /></span>
    <span className="ps-icon"><ToolbarIcon type="alignRight" /></span>
    <span className="ps-icon"><ToolbarIcon type="bounds" /></span>
    <span className="ps-icon"><ToolbarIcon type="alignCenter" /></span>
    <span className="ps-icon"><ToolbarIcon type="alignLeft" /></span>
    <i className="ps-divider" />
    <span className="ps-more">•••</span>
    <span className="ps-muted">3D Mode:</span>
    <span className="ps-3d">○ ⟲ ✦ ✓</span>
  </div>
)

const CustomCursor = () => {
  useEffect(() => {
    const cursor = document.querySelector('.custom-cursor')
    if (!cursor || !window.matchMedia('(pointer: fine)').matches) return undefined

    let rafId = 0
    let x = window.innerWidth / 2
    let y = window.innerHeight / 2

    document.documentElement.classList.add('has-custom-cursor')

    const render = () => {
      cursor.style.setProperty('--cursor-x', `${x}px`)
      cursor.style.setProperty('--cursor-y', `${y}px`)
      rafId = 0
    }

    const updatePosition = (event) => {
      x = event.clientX
      y = event.clientY
      cursor.classList.add('is-visible')
      const interactiveTarget = event.target?.closest?.(
        'a, button, input, textarea, select, summary, video, [role="button"], [tabindex]:not([tabindex="-1"])'
      )
      cursor.classList.toggle('is-interactive', Boolean(interactiveTarget))
      if (!rafId) rafId = window.requestAnimationFrame(render)
    }

    const press = () => cursor.classList.add('is-clicking')
    const release = () => cursor.classList.remove('is-clicking')
    const hide = () => {
      cursor.classList.remove('is-visible')
      cursor.classList.remove('is-clicking')
      cursor.classList.remove('is-interactive')
    }

    window.addEventListener('pointermove', updatePosition, { passive: true })
    window.addEventListener('pointerdown', press)
    window.addEventListener('pointerup', release)
    window.addEventListener('pointercancel', release)
    document.addEventListener('mouseleave', hide)
    window.addEventListener('blur', hide)

    return () => {
      document.documentElement.classList.remove('has-custom-cursor')
      window.removeEventListener('pointermove', updatePosition)
      window.removeEventListener('pointerdown', press)
      window.removeEventListener('pointerup', release)
      window.removeEventListener('pointercancel', release)
      document.removeEventListener('mouseleave', hide)
      window.removeEventListener('blur', hide)
      if (rafId) window.cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <div className="custom-cursor" aria-hidden="true">
      <img className="cursor-image cursor-image-arrow" src="/images/cursor/cursor-arrow.png" alt="" />
      <img className="cursor-image cursor-image-click" src="/images/cursor/cursor-hand-pink.png" alt="" />
    </div>
  )
}

const projects = [
  {
    id: '01',
    title: 'AIGC动画',
    type: 'AI ANIMATION',
    caption: '为马拉松与越野赛事构建高能量视觉叙事，从主视觉延展至线上传播与文创物料。',
    tone: 'ember',
    tag: '',
    glow: '18 92 66',
    colors: ['#ff7a45', '#f43f8b', '#ff5da8'],
  },
  {
    id: '02',
    title: 'AIGC与品牌视觉',
    type: 'AIGC & BRAND VISUAL',
    caption: '以生成式工作流重构产品场景、材质与光影，探索传统电商设计之外的视觉可能。',
    tone: 'violet',
    tag: '',
    glow: '270 88 78',
    colors: ['#a78bfa', '#e879f9', '#67e8f9'],
  },
  {
    id: '03',
    title: '平面插画',
    type: 'GRAPHIC ILLUSTRATION',
    caption: '围绕品牌调性搭建可复用的图文模板与内容语言，让高频创意生产保持一致与鲜活。',
    tone: 'blue',
    tag: '',
    glow: '198 92 70',
    colors: ['#38bdf8', '#818cf8', '#c084fc'],
  },
  {
    id: '04',
    title: '创意宣传',
    type: 'CREATIVE PROMOTION',
    caption: '从镜头语言、节奏到生成参数，设计 15–30 秒商业短片的完整视觉路径。',
    tone: 'silver',
    tag: '',
    glow: '258 62 82',
    colors: ['#e2e8f0', '#a78bfa', '#67e8f9'],
  },
]

const aigcVideos = [
  {
    label: '落地项目',
    title: '西游后传天地重光',
    meta: '西游记衍生AI漫剧',
    src: '/videos/aigc-01.mp4',
    note: '视频文件暂时无法加载，请确认 public/videos/aigc-01.mp4 是否存在。',
  },
  {
    label: 'DEMO',
    title: '西游后传天地重光',
    meta: '打斗抽卡测试',
    src: '/videos/aigc-02.mp4',
    note: '视频文件暂时无法加载，请确认 public/videos/aigc-02.mp4 是否存在。',
  },
  {
    label: 'DEMO',
    title: '公爹为夫密林场景',
    meta: '场景情绪渲染测试',
    src: '/videos/aigc-03.mp4',
    note: '视频文件暂时无法加载，请确认 public/videos/aigc-03.mp4 是否存在。',
  },
]

const brandVisualImages = [
  {
    title: '品牌视觉封面',
    meta: 'AIGC & BRAND VISUAL',
    src: '/images/brand/brand-01.jpg',
    note: '把第 1 张品牌视觉图片放到 public/images/brand/brand-01.jpg 后即可显示。',
  },
  {
    title: '产品场景系统',
    meta: 'PRODUCT IMAGE',
    src: '/images/brand/brand-02.jpg',
    note: '把第 2 张品牌视觉图片放到 public/images/brand/brand-02.jpg 后即可显示。',
  },
  {
    title: '活动版式延展',
    meta: 'LAYOUT DESIGN',
    src: '/images/brand/brand-03.jpg',
    note: '把第 3 张品牌视觉图片放到 public/images/brand/brand-03.jpg 后即可显示。',
  },
  {
    title: '视觉细节延展',
    meta: 'VISUAL DETAIL',
    src: '/images/brand/brand-04.jpg',
    note: '把第 4 张品牌视觉图片放到 public/images/brand/brand-04.jpg 后即可显示。',
  },
]

const galleryProjects = {
  '02': {
    eyebrow: 'BRAND VISUAL CASE',
    title: 'AIGC与品牌视觉',
    description: '以生成式影像、品牌主视觉与电商内容为核心，搭建统一但具有延展性的视觉系统。这里适合放项目封面、过程图、细节图与最终落地画面。',
    tags: ['AIGC', 'BRAND', 'LAYOUT'],
    images: brandVisualImages,
  },
  '03': {
    eyebrow: 'ILLUSTRATION CASE',
    title: '平面插画',
    layout: 'petal',
    description: '围绕人物、产品与社交内容场景展开插画视觉表达，适合展示平面插画、IP 形象、节日海报与内容延展画面。',
    tags: ['ILLUSTRATION', 'POSTER', 'SOCIAL'],
    images: [
      {
        title: '平面插画 01',
        meta: 'GRAPHIC ILLUSTRATION',
        src: '/images/illustration/illustration-01.png',
        note: '图片文件暂时无法加载，请确认 public/images/illustration/illustration-01.png 是否存在。',
      },
      {
        title: '平面插画 02',
        meta: 'CHARACTER DESIGN',
        src: '/images/illustration/illustration-02.png',
        note: '图片文件暂时无法加载，请确认 public/images/illustration/illustration-02.png 是否存在。',
      },
      {
        title: '平面插画 03',
        meta: 'POSTER SYSTEM',
        src: '/images/illustration/illustration-03.png',
        note: '图片文件暂时无法加载，请确认 public/images/illustration/illustration-03.png 是否存在。',
      },
      {
        title: '平面插画 04',
        meta: 'CONTENT DESIGN',
        src: '/images/illustration/illustration-04.png',
        note: '图片文件暂时无法加载，请确认 public/images/illustration/illustration-04.png 是否存在。',
      },
      {
        title: '平面插画 05',
        meta: 'GRAPHIC ILLUSTRATION',
        src: '/images/illustration/illustration-05.png',
        note: '图片文件暂时无法加载，请确认 public/images/illustration/illustration-05.png 是否存在。',
      },
      {
        title: '平面插画 06',
        meta: 'GRAPHIC ILLUSTRATION',
        src: '/images/illustration/illustration-06.png',
        note: '图片文件暂时无法加载，请确认 public/images/illustration/illustration-06.png 是否存在。',
      },
      {
        title: '平面插画 07',
        meta: 'GRAPHIC ILLUSTRATION',
        src: '/images/illustration/illustration-07.png',
        note: '图片文件暂时无法加载，请确认 public/images/illustration/illustration-07.png 是否存在。',
      },
      {
        title: '平面插画 08',
        meta: 'GRAPHIC ILLUSTRATION',
        src: '/images/illustration/illustration-08.png',
        note: '图片文件暂时无法加载，请确认 public/images/illustration/illustration-08.png 是否存在。',
      },
      {
        title: '平面插画 09',
        meta: 'GRAPHIC ILLUSTRATION',
        src: '/images/illustration/illustration-09.jpg',
        note: '图片文件暂时无法加载，请确认 public/images/illustration/illustration-09.jpg 是否存在。',
      },
      {
        title: '平面插画 10',
        meta: 'GRAPHIC ILLUSTRATION',
        src: '/images/illustration/illustration-10.jpg',
        note: '图片文件暂时无法加载，请确认 public/images/illustration/illustration-10.jpg 是否存在。',
      },
      {
        title: '平面插画 11',
        meta: 'GRAPHIC ILLUSTRATION',
        src: '/images/illustration/illustration-11.jpg',
        note: '图片文件暂时无法加载，请确认 public/images/illustration/illustration-11.jpg 是否存在。',
      },
      {
        title: '平面插画 12',
        meta: 'GRAPHIC ILLUSTRATION',
        src: '/images/illustration/illustration-12.jpg',
        note: '图片文件暂时无法加载，请确认 public/images/illustration/illustration-12.jpg 是否存在。',
      },
      {
        title: '平面插画 13',
        meta: 'GRAPHIC ILLUSTRATION',
        src: '/images/illustration/illustration-13.jpg',
        note: '图片文件暂时无法加载，请确认 public/images/illustration/illustration-13.jpg 是否存在。',
      },
      {
        title: '平面插画 14',
        meta: 'GRAPHIC ILLUSTRATION',
        src: '/images/illustration/illustration-14.jpg',
        note: '图片文件暂时无法加载，请确认 public/images/illustration/illustration-14.jpg 是否存在。',
      },
      {
        title: '平面插画 15',
        meta: 'GRAPHIC ILLUSTRATION',
        src: '/images/illustration/illustration-15.jpg',
        note: '图片文件暂时无法加载，请确认 public/images/illustration/illustration-15.jpg 是否存在。',
      },
      {
        title: '平面插画 16',
        meta: 'GRAPHIC ILLUSTRATION',
        src: '/images/illustration/illustration-16.png',
        note: '图片文件暂时无法加载，请确认 public/images/illustration/illustration-16.png 是否存在。',
      },
    ],
  },
  '04': {
    eyebrow: 'CREATIVE PROMOTION CASE',
    title: '创意宣传',
    description: '从传播主题、视觉钩子到社交媒体触点，展示创意宣传项目中的主画面、系列 KV、活动延展与落地物料。',
    tags: ['CAMPAIGN', 'KV', 'PROMOTION'],
    images: [
      {
        title: '创意宣传封面',
        meta: 'CREATIVE PROMOTION',
        src: '/images/promo/promo-01.jpg',
        note: '把第 1 张创意宣传图片放到 public/images/promo/promo-01.jpg 后即可显示。',
      },
      {
        title: '主视觉 KV',
        meta: 'CAMPAIGN KV',
        src: '/images/promo/promo-02.jpg',
        note: '把第 2 张创意宣传图片放到 public/images/promo/promo-02.jpg 后即可显示。',
      },
      {
        title: '社交媒体海报',
        meta: 'SOCIAL MEDIA',
        src: '/images/promo/promo-03.jpg',
        note: '把第 3 张创意宣传图片放到 public/images/promo/promo-03.jpg 后即可显示。',
      },
      {
        title: '物料延展',
        meta: 'VISUAL EXTENSION',
        src: '/images/promo/promo-04.jpg',
        note: '把第 4 张创意宣传图片放到 public/images/promo/promo-04.jpg 后即可显示。',
      },
    ],
  },
}

const capabilityModules = [
  {
    id: '01',
    title: '完整项目主导能力',
    type: 'CORE',
    points: ['需求拆解', '视觉方向', '落地交付'],
    insights: ['快速理解项目目标与人群', '建立清晰视觉方向与节奏', '推进从概念到完稿的闭环'],
  },
  {
    id: '02',
    title: '品牌视觉体系搭建',
    type: 'CORE',
    points: ['风格识别', '视觉规范', '传播一致'],
    insights: ['提炼品牌关键词与画面气质', '统一字体、色彩与版式规则', '让多渠道内容保持识别度'],
  },
  {
    id: '03',
    title: 'AI 设计提效',
    type: 'SYSTEM',
    points: ['AIGC 图像', '动态分镜', '创意验证'],
    insights: ['用 AI 扩展视觉方案数量', '辅助完成分镜与风格测试', '快速验证概念与内容方向'],
  },
  {
    id: '04',
    title: '设计管理统筹',
    type: 'SYSTEM',
    points: ['进度管理', '素材归档', '标准复用'],
    insights: ['拆分任务并控制交付节点', '沉淀素材库与设计规范', '提升团队协作与复用效率'],
  },
  {
    id: '05',
    title: '跨部门协同',
    type: 'SYSTEM',
    points: ['沟通转译', '内容运营', '商业转化'],
    insights: ['把需求转化成视觉语言', '理解运营节奏与内容目标', '兼顾审美表达与转化结果'],
  },
]

const timeline = [
  {
    date: '2025.10 — NOW',
    company: '中山蓓盾运动科技有限公司',
    role: '平面设计师',
    detail: '品牌视觉全案 / 赛事合作 / AIGC 产品影像 / 内容创意',
    duties: [
      '主导并独立执行核心营销节点的品牌视觉全案，运用 AI 辅助生成极具视觉冲击力的超高精度产品特写与海报，大幅提升电商平台及内容矩阵的点击与转化率。',
      '负责各项马拉松、越野赛等大型赛事项目线上线下的核心视觉合作设计，结合 AI 工具快速迭代概念方案，确保品牌调性准确、高效传达并为品牌赋能，参与赛事和品牌合作的文创产品生产到落地。',
      '使用主流 AI 工具（如即梦、Midjourney、Gemini、ChatGPT 等）独立完成 Prompt 设计、参数调试、素材生成和结果优化。',
      '负责品牌宣传创意，通过 AI 工具规模化产出高颜值的视觉图文与海报，提升品牌形象和用户视觉体验。',
    ],
  },
  {
    date: '2021.07 — 2025.09',
    company: '裕和科技有限公司',
    role: '视觉设计师',
    detail: '电商视觉 / 商业短视频分镜 / 营销活动',
    duties: [
      '独立负责多电商平台的网店整体视觉设计与迭代，在产品主图与详情页优化中，引入 AI 工具重构产品使用场景与氛围背景，确保视觉效果与产品特性相符合，有效提高店铺转化率。',
      '负责高强度、快节奏的商业短视频分镜脚本策划。主导开发过 15-20 秒的复杂商业向视频脚本，为后期引入 AI 视频模型进行动态生成打下坚实的镜头语言基础。',
      '与运营团队紧密合作，策划并执行店铺促销及节日活动视觉。确保品牌信息传达的准确性与吸引力。',
      '负责品牌内容视觉的创意设计和策划，结合平台节奏输出活动海报、主图延展与传播物料。',
    ],
  },
  {
    date: '2019.07 — 2021.05',
    company: '创者皮具有限公司',
    role: '跨境电商美工',
    detail: '跨境电商视觉定位 / 首页与详情页 / 平面广告',
    duties: [
      '负责跨境电商店铺整体视觉风格定位，统筹首页布局、轮播图及详情页制作，保证整体风格的统一性与品牌辨识度。',
      '负责电商平台平面广告图片制作，收集相关素材，整理、策划相关活动界面，奠定扎实的传统视觉设计功底与排版能力。',
    ],
  },
]

function ProjectVisual({ project }) {
  return (
    <div className={`project-visual ${project.tone}`}>
      <div className="visual-no">{project.id}</div>
      <div className="visual-grid" />
      <div className="orb orb-main" />
      <div className="orb orb-small" />
      <div className="orbit orbit-one" />
      <div className="orbit orbit-two" />
      {project.tag ? <span className="visual-tag">{project.tag}</span> : null}
      <span className="visual-coordinate">23°07′ N / 113°15′ E</span>
    </div>
  )
}

function VideoShowcaseModal({ open, videos, activeIndex, onSelect, onClose }) {
  const [videoErrors, setVideoErrors] = useState({})

  useEffect(() => {
    if (open) setVideoErrors({})
  }, [open])

  if (!open) return null
  const activeVideo = videos[activeIndex] || videos[0]
  const canPlayVideo = activeVideo.src && !videoErrors[activeIndex]

  return (
    <div className="video-modal" role="dialog" aria-modal="true" aria-label="AIGC 视频展示">
      <button className="video-modal-backdrop" type="button" onClick={onClose} aria-label="关闭视频展示" />
      <div className="video-modal-panel">
        <div className="video-modal-top">
          <div>
            <span>AIGC VIDEO SHOWCASE</span>
            <h3>{activeVideo.title}</h3>
          </div>
          <button className="video-close" type="button" onClick={onClose} aria-label="关闭">×</button>
        </div>

        <div className="video-modal-body">
          <div className="video-stage">
            {canPlayVideo ? (
              <video
                key={activeVideo.src}
                src={activeVideo.src}
                controls
                controlsList="nodownload noplaybackrate"
                disablePictureInPicture
                playsInline
                preload="metadata"
                onContextMenu={(event) => event.preventDefault()}
                onError={() => setVideoErrors((current) => ({ ...current, [activeIndex]: true }))}
              />
            ) : (
              <div className="video-placeholder">
                <i />
                <strong>VIDEO SLOT</strong>
                <p>{activeVideo.note}</p>
              </div>
            )}
          </div>

          <div className="video-playlist" aria-label="视频列表">
            {videos.map((video, index) => (
              <button
                className={index === activeIndex ? 'active' : ''}
                key={video.title}
                type="button"
                onClick={() => onSelect(index)}
              >
                <span>{String(index + 1).padStart(2, '0')}{video.label ? <b>{video.label}</b> : null}</span>
                <strong>{video.title}</strong>
                <em>{video.meta}</em>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function ImageShowcaseModal({ open, gallery, activeIndex, onSelect, onClose }) {
  const [imageErrors, setImageErrors] = useState({})
  const [zoomImageIndex, setZoomImageIndex] = useState(null)

  useEffect(() => {
    if (open) {
      setImageErrors({})
      setZoomImageIndex(null)
    }
  }, [open])

  if (!open) return null
  const images = gallery?.images || []
  const activeImage = images[activeIndex] || images[0]
  if (!activeImage) return null
  const canShowImage = activeImage.src && !imageErrors[activeIndex]
  const isSliderLayout = gallery.layout === 'slider'
  const isShuffleLayout = gallery.layout === 'shuffle'
  const isPetalLayout = gallery.layout === 'petal'
  const goToPrevImage = () => onSelect((activeIndex - 1 + images.length) % images.length)
  const goToNextImage = () => onSelect((activeIndex + 1) % images.length)
  const shuffleStack = [0, 1, 2].map((offset) => {
    const index = (activeIndex + offset) % images.length
    return { image: images[index], index, position: offset === 0 ? 'front' : offset === 1 ? 'middle' : 'back' }
  })
  const petalItems = images.map((image, index) => {
    const total = images.length
    let delta = index - activeIndex
    if (delta > total / 2) delta -= total
    if (delta < -total / 2) delta += total
    const distance = Math.abs(delta)
    const isActive = index === activeIndex
    const x = delta * 156
    const y = 42 + distance * 18
    const scale = Math.max(0.46, 1 - distance * 0.095)
    const opacity = distance > 5 ? 0 : Math.max(0.16, 1 - distance * 0.16)
    return {
      image,
      index,
      isActive,
      style: {
        '--petal-x': `${x.toFixed(1)}px`,
        '--petal-y': `${y.toFixed(1)}px`,
        '--petal-r': `${(delta * -4.8).toFixed(1)}deg`,
        '--petal-s': scale.toFixed(3),
        '--petal-o': opacity.toFixed(3),
        '--petal-z': isActive ? 80 : 60 - distance,
      },
    }
  })

  const renderImageSlide = (image, index) => {
    const canRender = image.src && !imageErrors[index]
    return canRender ? (
      <img
        key={image.src}
        src={image.src}
        alt={image.title}
        onError={() => setImageErrors((current) => ({ ...current, [index]: true }))}
      />
    ) : (
      <div className="gallery-placeholder">
        <span>{String(index + 1).padStart(2, '0')}</span>
        <strong>IMAGE SLOT</strong>
        <p>{image.note}</p>
      </div>
    )
  }

  return (
    <div className="video-modal gallery-modal" role="dialog" aria-modal="true" aria-label={`${gallery.title} 图片展示`}>
      <button className="video-modal-backdrop" type="button" onClick={onClose} aria-label="关闭图片展示" />
      <div className={`video-modal-panel gallery-panel ${isPetalLayout ? 'is-petal-panel' : ''}`}>
        <div className={`video-modal-top ${isPetalLayout ? 'is-compact' : ''}`}>
          <div>
            <span>{gallery.eyebrow}</span>
            <h3>{gallery.title}</h3>
          </div>
          <button className="video-close" type="button" onClick={onClose} aria-label="关闭">×</button>
        </div>

        <div className={`gallery-body ${isSliderLayout ? 'is-slider' : ''} ${isShuffleLayout ? 'is-shuffle' : ''} ${isPetalLayout ? 'is-petal' : ''}`}>
          <div className="gallery-stage">
            {isSliderLayout ? (
              <div className="illustration-slider" aria-label="平面插画滑动图片展示">
                <div className="illustration-track" style={{ transform: `translateX(-${activeIndex * 100}%)` }}>
                  {images.map((image, index) => (
                    <div className="illustration-slide" key={image.title}>
                      {renderImageSlide(image, index)}
                    </div>
                  ))}
                </div>
                <div className="slider-counter">{String(activeIndex + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}</div>
                <div className="slider-controls">
                  <button type="button" onClick={goToPrevImage} aria-label="查看上一张图片">←</button>
                  <button type="button" onClick={goToNextImage} aria-label="查看下一张图片">→</button>
                </div>
              </div>
            ) : isShuffleLayout ? (
              <div className="illustration-shuffle" aria-label="平面插画卡片洗牌展示">
                <div className="shuffle-card-stack">
                  {shuffleStack.map(({ image, index, position }) => (
                    <button
                      className={`shuffle-image-card ${position}`}
                      key={`${image.title}-${index}`}
                      type="button"
                      onClick={goToNextImage}
                      aria-label="切换下一张插画"
                    >
                      {renderImageSlide(image, index)}
                    </button>
                  ))}
                </div>
                <div className="slider-counter">{String(activeIndex + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}</div>
                <div className="slider-controls">
                  <button type="button" onClick={goToPrevImage} aria-label="查看上一张图片">←</button>
                  <button type="button" onClick={goToNextImage} aria-label="查看下一张图片">→</button>
                </div>
                <p className="shuffle-hint">CLICK CARD TO SHUFFLE</p>
              </div>
            ) : isPetalLayout ? (
              <div className="illustration-petal" aria-label="平面插画花瓣式图片展示">
                <div className="petal-cloud">
                  {petalItems.map(({ image, index, isActive, style }) => (
                    <button
                      className={`petal-image-card ${isActive ? 'active' : ''}`}
                      key={image.title}
                      type="button"
                      style={style}
                      onClick={() => {
                        onSelect(index)
                        setZoomImageIndex(index)
                      }}
                      aria-label={`放大查看 ${image.title}`}
                    >
                      {renderImageSlide(image, index)}
                    </button>
                  ))}
                </div>
                <div className="petal-footer">
                  <span>{String(activeIndex + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}</span>
                  <p>CLICK IMAGE TO VIEW</p>
                  <div className="slider-controls">
                    <button type="button" onClick={goToPrevImage} aria-label="查看上一张图片">←</button>
                    <button type="button" onClick={goToNextImage} aria-label="查看下一张图片">→</button>
                  </div>
                </div>
              </div>
            ) : canShowImage ? (
              renderImageSlide(activeImage, activeIndex)
            ) : (
              <div className="gallery-placeholder">
                <span>{String(activeIndex + 1).padStart(2, '0')}</span>
                <strong>IMAGE SLOT</strong>
                <p>{activeImage.note}</p>
              </div>
            )}
          </div>

          {!isPetalLayout ? <aside className="gallery-info">
            <span className="gallery-index">{String(activeIndex + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}</span>
            <h4>{activeImage.title}</h4>
            <p>{gallery.description}</p>
            <div className="gallery-tags">
              {gallery.tags.map((tag) => <span key={tag}>{tag}</span>)}
            </div>
          </aside> : null}

          {!isSliderLayout && !isShuffleLayout && !isPetalLayout ? (
            <div className="gallery-thumbs" aria-label="图片列表">
              {images.map((image, index) => (
                <button
                  className={index === activeIndex ? 'active' : ''}
                  key={image.title}
                  type="button"
                  onClick={() => onSelect(index)}
                >
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <strong>{image.title}</strong>
                  <em>{image.meta}</em>
                </button>
              ))}
            </div>
          ) : null}
        </div>
      </div>
      {isPetalLayout && zoomImageIndex !== null && images[zoomImageIndex] ? (
        <div className="petal-zoom-layer" role="dialog" aria-modal="false" aria-label="image preview">
          <button
            className="petal-zoom-backdrop"
            type="button"
            onClick={() => setZoomImageIndex(null)}
            aria-label="close image preview"
          />
          <div className="petal-zoom-image">
            {renderImageSlide(images[zoomImageIndex], zoomImageIndex)}
          </div>
          <button
            className="petal-zoom-close"
            type="button"
            onClick={() => setZoomImageIndex(null)}
            aria-label="close"
          >
            ×
          </button>
        </div>
      ) : null}
    </div>
  )
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [navScrolled, setNavScrolled] = useState(false)
  const [videoModalOpen, setVideoModalOpen] = useState(false)
  const [activeVideoIndex, setActiveVideoIndex] = useState(0)
  const [galleryModalOpen, setGalleryModalOpen] = useState(false)
  const [activeGalleryIndex, setActiveGalleryIndex] = useState(0)
  const [activeGalleryProjectId, setActiveGalleryProjectId] = useState('02')
  const [activeCareerIndex, setActiveCareerIndex] = useState(null)
  const [activeCapabilityId, setActiveCapabilityId] = useState(null)

  useEffect(() => {
    const updateNav = () => setNavScrolled(window.scrollY >= window.innerHeight - 80)
    updateNav()
    window.addEventListener('scroll', updateNav, { passive: true })
    window.addEventListener('resize', updateNav)
    return () => {
      window.removeEventListener('scroll', updateNav)
      window.removeEventListener('resize', updateNav)
    }
  }, [])

  useEffect(() => {
    const hero = document.querySelector('#home')
    const about = document.querySelector('#about')
    const works = document.querySelector('#works')
    const strengths = document.querySelector('#strengths')
    const contact = document.querySelector('#contact')
    const motionSections = [hero, about, works, strengths, contact].filter(Boolean)
    if (!motionSections.length) return undefined

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion) {
      hero?.classList.add('hero-visible')
      about?.classList.add('about-visible')
      works?.classList.add('works-visible')
      strengths?.classList.add('strengths-visible')
      contact?.classList.add('contact-visible')
      return undefined
    }

    hero?.classList.add('hero-motion-ready')
    about?.classList.add('about-motion-ready')
    works?.classList.add('works-motion-ready')
    strengths?.classList.add('strengths-motion-ready')
    contact?.classList.add('contact-motion-ready')

    const visibleClasses = {
      home: 'hero-visible',
      about: 'about-visible',
      works: 'works-visible',
      strengths: 'strengths-visible',
      contact: 'contact-visible',
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const visibleClass = visibleClasses[entry.target.id]
        if (!visibleClass) return
        entry.target.classList.toggle(visibleClass, entry.isIntersecting)

        if (entry.target.id === 'home') {
          document.documentElement.classList.toggle('hero-visible', entry.isIntersecting)
        }
      })
    }, {
      threshold: 0.22,
      rootMargin: '0px 0px -12% 0px',
    })

    motionSections.forEach((section) => observer.observe(section))
    return () => {
      observer.disconnect()
      document.documentElement.classList.remove('hero-visible')
    }
  }, [])

  useEffect(() => {
    document.body.classList.toggle('modal-open', videoModalOpen || galleryModalOpen)
    const handleEscape = (event) => {
      if (event.key === 'Escape') setVideoModalOpen(false)
      if (event.key === 'Escape') setGalleryModalOpen(false)
    }
    window.addEventListener('keydown', handleEscape)
    return () => {
      document.body.classList.remove('modal-open')
      window.removeEventListener('keydown', handleEscape)
    }
  }, [videoModalOpen, galleryModalOpen])

  const scrollTo = (id) => {
    document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' })
    setMenuOpen(false)
  }

  const handlePortraitTilt = (event) => {
    const card = event.currentTarget
    const rect = card.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    const offsetX = (x / rect.width - 0.5) * 2
    const offsetY = (y / rect.height - 0.5) * 2

    card.style.setProperty('--tilt-rx', `${(-offsetY * 8).toFixed(2)}deg`)
    card.style.setProperty('--tilt-ry', `${(offsetX * 10).toFixed(2)}deg`)
    card.style.setProperty('--tilt-scale', '1.035')
    card.style.setProperty('--glow-x', `${x}px`)
    card.style.setProperty('--glow-y', `${y}px`)
  }

  const resetPortraitTilt = (event) => {
    const card = event.currentTarget
    card.style.setProperty('--tilt-rx', '0deg')
    card.style.setProperty('--tilt-ry', '0deg')
    card.style.setProperty('--tilt-scale', '1')
    card.style.setProperty('--glow-x', '50%')
    card.style.setProperty('--glow-y', '28%')
  }

  const canOpenProject = (project) => project.id === '01' || Boolean(galleryProjects[project.id])

  const openProjectVideos = (project) => {
    if (project.id !== '01') return
    setActiveVideoIndex(0)
    setVideoModalOpen(true)
  }

  const openProjectGallery = (project) => {
    if (!galleryProjects[project.id]) return
    setActiveGalleryProjectId(project.id)
    setActiveGalleryIndex(0)
    setGalleryModalOpen(true)
  }

  const openProjectShowcase = (project) => {
    if (project.id === '01') openProjectVideos(project)
    if (galleryProjects[project.id]) openProjectGallery(project)
  }

  return (
    <main>
      <CustomCursor />
      <div className="site-color-bends" aria-hidden="true">
        <ColorBends
          colors={['#120918', '#25102f', '#472254', '#7e2c58']}
          rotation={92}
          autoRotate={0.28}
          speed={0.07}
          scale={1.08}
          frequency={1.08}
          warpStrength={0.54}
          mouseInfluence={0.16}
          parallax={0.12}
          noise={0}
          iterations={2}
          intensity={0.72}
          bandWidth={4.7}
          transparent
        />
      </div>

      <header className={`nav shell${navScrolled ? ' scrolled' : ''}`}>
        <button className="logo" onClick={() => scrollTo('#home')} aria-label="返回首页">
          <span className="logo-mark">ZY</span>
          <span className="logo-copy">HUANG ZIYING<br />PORTFOLIO · 2026</span>
        </button>
        <nav className={menuOpen ? 'open' : ''} aria-label="主导航">
          <button onClick={() => scrollTo('#about')}>关于我</button>
          <button onClick={() => scrollTo('#works')}>视觉展示</button>
          <button onClick={() => scrollTo('#strengths')}>个人优势</button>
        </nav>
        <button className="contact-pill" onClick={() => scrollTo('#contact')}>
          LET'S TALK <Arrow diagonal />
        </button>
        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label="展开菜单">
          <span /><span />
        </button>
      </header>

      <section className="hero" id="home">
        <div className="hero-soft-aurora" aria-hidden="true">
          <SoftAurora
            speed={0.28}
            scale={2.05}
            brightness={0.78}
            color1="#ff5da8"
            color2="#5f7dff"
            noiseFrequency={2.85}
            noiseAmplitude={0.58}
            bandHeight={0.5}
            bandSpread={0.72}
            octaveDecay={0.18}
            layerOffset={0.36}
            colorSpeed={0.42}
            enableMouseInteraction
            mouseInfluence={0.08}
          />
        </div>
        <PhotoshopBar />
        <div className="hero-transition" aria-hidden="true" />

        <div className="hero-content shell">
          <div className="hero-title-block">
            <div className="hero-laying-character" aria-hidden="true">
              <img src="/hero-qgirl-laying-cutout.png" alt="" />
            </div>
            <button className="hero-smile-icon" type="button" onClick={() => scrollTo('#works')} aria-label="跳转到视觉展示">
              <img src="/smile-icon.gif" alt="" aria-hidden="true" />
            </button>
            <h1 className="portfolio-title portfolio-reference portfolio-cover-title" aria-label="PORTFOLIO">
              <img src="/portfolio-cover-title-pink.png" alt="" aria-hidden="true" />
            </h1>
            <div className="hero-sticker">VISUAL · AI · CONTENT DESIGN</div>
          </div>
          <div className="hero-bottom">
            <p>在视觉秩序与生成式想象之间，<br />创造有情绪，也有效率的内容。</p>
            <button className="round-arrow" onClick={() => scrollTo('#about')} aria-label="向下浏览"><Arrow /></button>
            <div className="status"><i /> AVAILABLE FOR OPPORTUNITIES<br />BASED IN GUANGDONG, CHINA</div>
          </div>
        </div>
      </section>

      <div className="liquid-panels" aria-hidden="false">
        <div className="panels-liquid-bg" aria-hidden="true">
          <LiquidEther
            colors={['#08060b', '#ff5da8', '#4a1735', '#241122']}
            autoSpeed={0.42}
            autoIntensity={1.18}
            resolution={0.65}
            className="portfolio-liquid-ether"
          />
        </div>

      <section className="about section" id="about">
        <div className="shell">
          <div className="section-kicker"><span>02</span><p>关于我</p></div>
          <div className="about-grid">
            <div className="portrait-wrap">
              <div className="portrait tilted-portrait" onPointerMove={handlePortraitTilt} onPointerLeave={resetPortraitTilt}>
                <div className="portrait-halo" />
                <img className="portrait-avatar" src="/about-avatar-chair.png" alt="黄子盈 3D 形象" />
                <div className="portrait-label">ZIYING HUANG<br />VISUAL & AI DESIGNER</div>
              </div>
              <span className="portrait-note">梦想是去任何想去的地方</span>
            </div>

            <div className="about-copy">
              <p className="eyebrow">HELLO, I'M ZIYING.</p>
              <h2>让想象力落地，<br />让设计拥有<span>新的引力。</span></h2>
              <p className="lead">我是一名拥有 7 年经验的视觉设计师，也是一名持续探索生成式 AI 的创作者。动画专业训练赋予我对造型、分镜和叙事的敏感，而商业项目经验让我更在意创意如何真正被看见、被理解、被使用。</p>
              <p className="secondary">从品牌主视觉、电商内容到 AIGC 图像与视频，我擅长在传统设计方法与 AI 工作流之间切换，为团队搭建可复用、可规模化的创意系统。</p>
              <div className="stats">
                <div><strong>07<sup>+</sup></strong><span>工作经验</span></div>
                <div><strong>30<sup>+</sup></strong><span>年均落地项目</span></div>
                <div><strong>95<sup>%+</sup></strong><span>客户满意度</span></div>
              </div>
              <div className="contact-lines">
                <a href="mailto:978580173@qq.com">978580173@qq.com <Arrow diagonal /></a>
                <a href="tel:19928000730">+86 199 2800 0730 <Arrow diagonal /></a>
                <button type="button" onClick={() => navigator.clipboard?.writeText('as978580173')}>WECHAT · as978580173 <Arrow diagonal /></button>
              </div>
            </div>
          </div>

          <div className="timeline career-path">
            <div className="timeline-header">
              <span>CAREER PATH</span>
              <h3>工作经历</h3>
            </div>
            <div className="career-track">
            {timeline.map((item, index) => (
              <article key={item.date} className={activeCareerIndex === index ? 'career-active' : ''}>
                <i className="career-node" aria-hidden="true" />
                <time>{item.date}</time>
                <div>
                  <button
                    className="career-company"
                    type="button"
                    aria-expanded={activeCareerIndex === index}
                    onClick={() => setActiveCareerIndex(activeCareerIndex === index ? null : index)}
                  >
                    {item.company}
                  </button>
                  <span>{item.role}</span>
                  <p>{item.detail}</p>
                  <div className="career-detail-panel" aria-hidden={activeCareerIndex !== index}>
                    <strong>任职内容</strong>
                    <ul>
                      {item.duties.map((duty) => (
                        <li key={duty}>{duty}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </article>
            ))}
            </div>
          </div>
        </div>
      </section>

      <section className="works section" id="works">
        <div className="shell">
          <div className="section-kicker light"><span>03</span><p>视觉展示</p></div>
          <div className="works-heading">
            <h2>VISUAL<br /><em>DISPLAY</em></h2>
            <div className="works-falling-character" aria-hidden="true">
              <img src="/works-character-crouch-new.png" alt="" />
            </div>
            <div className="works-thought-bubble" aria-hidden="true">
              <img className="thought-cloud" src="/images/character/thought-bubble.png" alt="" />
              <div className="thought-product-carousel">
                <img className="thought-product thought-drink" src="/images/thought/thought-drink.png" alt="" />
                <img className="thought-product thought-plane" src="/images/thought/thought-plane.png" alt="" />
                <img className="thought-product thought-player" src="/images/thought/thought-player.png" alt="" />
                <img className="thought-product thought-suitcase" src="/images/thought/thought-suitcase.png" alt="" />
              </div>
            </div>
            <p>一些关于速度、质感、内容与未来的视觉实验。<br />真实项目图片将在下一阶段替换。</p>
          </div>
          <div className="projects-grid">
            {projects.map((project, index) => (
              <BorderGlow
                className={`project-card ${index % 3 === 0 ? 'wide' : ''}`}
                key={project.id}
                edgeSensitivity={34}
                glowColor={project.glow}
                backgroundColor="#101016"
                borderRadius={26}
                glowRadius={34}
                glowIntensity={1.15}
                coneSpread={24}
                fillOpacity={0.32}
                animated
                colors={project.colors}
              >
                <article
                  className={`project-card-content ${project.id === '01' ? 'is-video-trigger' : ''} ${galleryProjects[project.id] ? 'is-gallery-trigger' : ''}`}
                  role={canOpenProject(project) ? 'button' : undefined}
                  tabIndex={canOpenProject(project) ? 0 : undefined}
                  onClick={() => openProjectShowcase(project)}
                  onKeyDown={(event) => {
                    if (canOpenProject(project) && (event.key === 'Enter' || event.key === ' ')) {
                      event.preventDefault()
                      openProjectShowcase(project)
                    }
                  }}
                >
                  <ProjectVisual project={project} />
                  <div className="project-meta">
                    <div><span>{project.type}</span><h3>{project.title}</h3></div>
                    <p>{project.caption}</p>
                    <button
                      aria-label={`查看 ${project.title}`}
                      onClick={(event) => {
                        event.stopPropagation()
                        openProjectShowcase(project)
                      }}
                    >
                      <Arrow diagonal />
                    </button>
                  </div>
                </article>
              </BorderGlow>
            ))}
          </div>
        </div>
      </section>

      <section className="strengths section" id="strengths">
        <div className="shell">
          <div className="section-kicker"><span>04</span><p>个人优势 / 创作方法</p></div>
          <div className="capability-layout">
            <div className="capability-card-grid">
              {capabilityModules.map((item) => (
                <button
                  className={`capability-card ${item.featured ? 'featured' : ''} ${activeCapabilityId === item.id ? 'is-open' : ''}`}
                  key={item.id}
                  onClick={() => setActiveCapabilityId(activeCapabilityId === item.id ? null : item.id)}
                  aria-expanded={activeCapabilityId === item.id}
                  aria-label={`查看${item.title}优势说明`}
                >
                  <span className="capability-no">{item.id}</span>
                  <span className="capability-type">{item.type}</span>
                  <h3>{item.title}<i /></h3>
                  <span className="capability-bubble-menu" aria-hidden={activeCapabilityId !== item.id}>
                    {item.insights.map((insight, bubbleIndex) => (
                      <em key={insight} style={{ '--bubble-index': bubbleIndex }}>
                        {insight}
                      </em>
                    ))}
                  </span>
                  <span className={`capability-icon capability-icon-${item.id}`} aria-hidden="true">
                    <span />
                    <span />
                    <span />
                  </span>
                </button>
              ))}
            </div>
            <div className="capability-copy">
              <h2>DESIGN<br /><em>ADVANTAGE</em></h2>
              <p>
                扎实的美术功底、良好的创意思维和理解能力，能及时把握客户需求，善于与人沟通，能够承受压力，能独立完成相关视觉或界面的创意、设计到完稿全套工作流程，保证工作质量。持续关注AI如何重塑创意生产，乐于探索生成式AI的新应用与新方法，具备优秀的跨团队协作能力与自驱力。
              </p>
              <img
                className="capability-tool-gift"
                src="/images/character/ai-tools-gift-cutout.png"
                alt=""
                aria-hidden="true"
              />
              <img
                className="capability-character"
                src="/images/character/strengths-designer-full.png"
                alt="AI 设计师人物形象"
              />
            </div>
          </div>
        </div>
      </section>
      </div>

      <footer className="contact" id="contact">
        <div className="contact-rings" aria-hidden="true">
          <MagicRings
            color="#ff5da8"
            colorTwo="#ff9acb"
            ringCount={5}
            speed={0.32}
            attenuation={12}
            lineThickness={1.05}
            baseRadius={0.23}
            radiusStep={0.085}
            scaleRate={0.055}
            opacity={0.38}
            blur={0.72}
            noiseAmount={0.01}
            rotation={18}
            ringGap={1.14}
            fadeIn={0.9}
            fadeOut={0.62}
            followMouse
            mouseInfluence={0.04}
            hoverScale={1.03}
            parallax={0.02}
            clickBurst={false}
          />
        </div>
        <div className="noise" aria-hidden="true" />
        <div className="shell contact-inner">
          <div className="section-kicker light"><span>05</span><p>联系我 / 合作沟通</p></div>
          <div className="contact-main">
            <p className="eyebrow">HAVE AN IDEA IN MIND?</p>
            <h2><span>LOVE</span><br /><em>AND</em><br /><span>LEARN.</span></h2>
            <div className="contact-action-row">
              <a className="mail-link" href="mailto:978580173@qq.com">978580173@qq.com <Arrow diagonal /></a>
              <button className="wechat-link" type="button" onClick={() => navigator.clipboard?.writeText('as978580173')}>WECHAT · as978580173 <Arrow diagonal /></button>
            </div>
          </div>
          <div className="contact-footer">
            <p>视觉设计 / AIGC 内容 / 品牌合作 / 创意视觉</p>
            <p>© 2026 ZIYING HUANG. ALL RIGHTS RESERVED.</p>
            <button onClick={() => scrollTo('#home')}>BACK TO TOP →</button>
          </div>
        </div>
      </footer>

      <VideoShowcaseModal
        open={videoModalOpen}
        videos={aigcVideos}
        activeIndex={activeVideoIndex}
        onSelect={setActiveVideoIndex}
        onClose={() => setVideoModalOpen(false)}
      />
      <ImageShowcaseModal
        open={galleryModalOpen}
        gallery={galleryProjects[activeGalleryProjectId]}
        activeIndex={activeGalleryIndex}
        onSelect={setActiveGalleryIndex}
        onClose={() => setGalleryModalOpen(false)}
      />
    </main>
  )
}

export default App
