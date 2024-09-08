<template>

  <q-page class="q-pa-sm">
    <div class="row justify-center ">
      <div class="col-12 q-pa-md" style="max-width: 1080px;">
        <h3>GeoNode Help</h3>
        <q-separator />
        <br />
        <p class="text-h5">This page provides helpful information about how to use the GeoNode. You can use the sidebar links to navigate to what you want to know.</p>
        <p>The GeoNode provides access to data sets and a map editing application allows users to browse existing maps and contribute their own.</p>
        <p class="text-h6">Browsing Layers</p>
        <p>The <NuxtLink to="/catalogue/dataset">Layers</NuxtLink> tab allows you to browse data uploaded to this GeoNode. All data can be downloaded in a variety of formats, for use in other applications.</p>
        <p class="text-h6">Developer Access</p>
        <p>The <NuxtLink to="/developer">Developer</NuxtLink> page is the place for developers to get started building applications against the GeoNode. It includes instructions on using the web services, links to the source code of the GeoNode, and information about the open source projects used to create it.</p>
        <p class="text-h6">Browsing Maps</p>
        <p></p>
        <p class="text-h6">Creating a Map</p>
        <p></p>
        <p class="text-h6">Publishing a Map</p>
        <p></p>
        <p class="text-h6">Remixing a Map</p>
        <p></p>

      </div>
    </div>



  </q-page>


  <q-separator />

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

const {getSession, data} = useAuth()

const authStore = useAuthStore()

const {
  status,
  loading,
  lastRefreshedAt
} = useAuthState()

// const {data: token} = await useFetch('/api/token', {headers})
</script>