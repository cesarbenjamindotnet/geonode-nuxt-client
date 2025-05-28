export default defineEventHandler(() => {
  const config = useRuntimeConfig()
  return {
    env: config.public
  }
})
