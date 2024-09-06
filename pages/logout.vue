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
const config = useRuntimeConfig()

const { signOut } = useAuth()

const handleLogout = async () => {
  isProcessing.value = true
  try {

    const revokeTokenURL = `${config.public.GEONODE_BASEURL}/o/revoke_token/`



    const revokeTokenResponse = await useFetch(revokeTokenURL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authStore.token.refresh_token}`,
      },
    })

    console.log("post logout geonode revokeTokenResponse:", revokeTokenResponse)
    console.log("post logout geonode revokeTokenURL:", revokeTokenURL)

    alert("espera")

    await signOut()

    console.log("post logout nuxtauth")

  } catch (error) {
    console.log("error")
    console.error(error)
  } finally {
    isProcessing.value = false
    console.log("finally")
    await router.push('/')
  }
}
</script>

<style scoped>

</style>