import { ref, onMounted, onUnmounted } from 'vue'

export function useScrollReveal() {
  const target = ref(null)
  const isVisible = ref(false)

  let observer

  onMounted(() => {
    observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          isVisible.value = true
          observer.unobserve(entry.target)
        }
      },
      { threshold: 0.15 },
    )
    if (target.value) observer.observe(target.value)
  })

  onUnmounted(() => {
    observer?.disconnect()
  })

  return { target, isVisible }
}
