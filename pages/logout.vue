<template>
  <q-page>
    <p>Logout</p>
    <p>Are you sure you want to logout?</p>
    <q-btn label="Yes" color="primary" @click="handleLogout"/>
    <q-btn label="No" color="primary" to="/"/>
  </q-page>
</template>

<script setup lang="ts">
const {logout} = useAuth()
const isProcessing = ref(false)
const authStore = useAuthStore()
const router = useRouter()

const {
  status,
  loading,
  lastRefreshedAt,
  accessToken,
  signOut,
} = useAuthState()

const handleLogout = async () => {
  isProcessing.value = true
  try {
    await signOut()

    await fetch(`${process.env.NUXT_GEONODE_ISSUER}/revoke-token/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
    })
  } catch (error) {
    console.error(error)
  } finally {
    isProcessing.value = false
    await router.push('/')
  }
}
</script>

<style scoped>

</style>