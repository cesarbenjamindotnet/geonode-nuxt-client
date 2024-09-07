<template>
  <q-page>
    <p>Logout</p>
    <p>Are you sure you want to logout?</p>
    <q-btn label="Yes" color="primary" @click="handleLogout"/>
    <q-btn label="No" color="primary" to="/"/>
  </q-page>
</template>

<script setup lang="ts">
const isProcessing = ref(false)
const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()
const config = useRuntimeConfig()

const {signOut} = useAuth()

const handleLogout = async () => {
  isProcessing.value = true
  try {

    const response = await useFetch('/api/auth/geonode-signout', {
      method: 'POST',
      body: {
        token: authStore.token
      },
      headers: {
        'Content-Type': 'application/json'
      }
    })

    console.log("response: ", response)

    const logoutUrl = `${config.public.GEONODE_BASEURL}/api/v2/geonuxt/logout`
    const returnUrl = `${config.public.NUXT_BASE_URL}`

    const redirectLogoutUrl = `${logoutUrl}?next=${returnUrl}`
    console.log("redirectLogoutUrl: ", redirectLogoutUrl)

    await signOut({
      redirect: false,
    })

    window.location.href = redirectLogoutUrl

  } catch (error) {
    console.error(error)
  }
}
</script>

<style scoped>

</style>