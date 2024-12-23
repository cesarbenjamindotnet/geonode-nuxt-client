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

    // const logoutUrl = `${config.public.NUXT_OIDC_ISSUER}/protocol/openid-connect/logout`
    // const returnUrl = window.location.origin

    // const redirectLogoutUrl = `${logoutUrl}?redirect_uri=${encodeURIComponent(returnUrl)}`
    // console.log("redirectLogoutUrl: ", redirectLogoutUrl)

    await signOut({
      redirect: false,
    })
        .then(() => {
          console.log("User signed out")
          fetch(`${config.public.NUXT_OIDC_ISSUER}/protocol/openid-connect/logout`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
              client_id: config.public.NUXT_OIDC_CLIENT_ID.toString(),
              client_secret: config.public.NUXT_OIDC_CLIENT_SECRET.toString(),
              refresh_token: authStore.token.refresh_token
            })
          }).then((response) => {
            console.log("response: ", response)
            authStore.clearAuth()
            router.push({path: '/'})
          }).catch((error) => {
            console.error("Error signing out: ", error)
          })

          // window.location.href = redirectLogoutUrl

        })
  } catch (error) {
    console.error(error)
  }
}
</script>

<style scoped>

</style>