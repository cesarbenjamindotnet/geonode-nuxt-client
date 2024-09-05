<template>
  <div v-if="data">
    <!-- You can access the session data you injected above! -->
    Hello, Data: {{ data.user }}. You have the role: {{ 'data.user.profile.perms' }}!
  </div>
  <q-separator/>
  <div>Token: {{ authStore.token || 'no token present, are you logged in?' }}</div>
  <button v-for="provider in providers" :key="provider.id" @click="signIn(provider.id)">
    Sign in with {{ provider.name }}
  </button>
  <br>
  <button @click="() => getSession()">
    Refresh
  </button>
  <button @click="() => getSession({ required: true })">
    Refresh or trigger signin
  </button>
  <p>status: {{ status }}</p>
  <p>loading: {{ loading }}</p>
  <p>session: {{ data }}</p>
  <p>lastRefreshedAt: {{ lastRefreshedAt }}</p>
  <hr>

</template>


<script setup lang="ts">
// Remember to disable the middleware protection from your page!
/*
definePageMeta({
  auth: {unauthenticatedOnly: true, navigateAuthenticatedTo: '/'}
})
*/

// const headers = useRequestHeaders(['cookie']) as HeadersInit
const {signIn, getProviders} = useAuth()
const providers = await getProviders()

const {getSession} = useAuth()

const authStore = useAuthStore()

const {
  status,
  loading,
  data,
  lastRefreshedAt
} = useAuthState()

// const {data: token} = await useFetch('/api/token', {headers})
</script>