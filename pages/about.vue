<template>
  <div v-if="data">
    <!-- You can access the session data you injected above! -->
    Hello, {{ data.user }}. You have the role: {{ data.user.profile.perms }}!


  </div>
  <q-separator/>
  <div>{{ token || 'no token present, are you logged in?' }}</div>
  <button v-for="provider in providers" :key="provider.id" @click="signIn(provider.id)">
    Sign in with {{ provider.name }}
  </button>
</template>


<script setup lang="ts">
// Remember to disable the middleware protection from your page!
definePageMeta({
  auth: {unauthenticatedOnly: true, navigateAuthenticatedTo: '/'}
})

const {signIn, getProviders} = useAuth()
const providers = await getProviders()
const {data} = useAuth()
const headers = useRequestHeaders(['cookie']) as HeadersInit
const {data: token} = await useFetch('/api/token', {headers})
</script>