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