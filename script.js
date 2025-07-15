import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const scrollState = { progress: 0 }

const interpolate = (start, end, scrollProgress) => start + (end - start) * scrollProgress
const imageSection = document.querySelector('.image-section')

const startPoints = [
  [20, 40],
  [80, 40],
  [80, 100],
  [20, 100],
]

const endPoints = [
  [0, 0],
  [100, 0],
  [100, 100],
  [0, 100],
]

const progressProxyHandler = {
  set(target, key, value) {
    target[key] = value

    const currentPoints = startPoints.map(([sx, sy], i) => {
      const [ex, ey] = endPoints[i]
      const x = interpolate(sx, ex, scrollState.progress)
      const y = interpolate(sy, ey, scrollState.progress)
      return `${x}% ${y}%`
    })

    imageSection.style.clipPath = `polygon(${currentPoints.join(', ')})`

    return true
  }
}

const scrollProgressProxy = new Proxy(scrollState, progressProxyHandler)

const scrollTimeline = gsap.timeline()
scrollTimeline.to(scrollProgressProxy, {
  progress: 1
})

ScrollTrigger.create({
  animation: scrollTimeline,
  start: 'top top',
  end: 'bottom bottom',
  scrub: 1
})
