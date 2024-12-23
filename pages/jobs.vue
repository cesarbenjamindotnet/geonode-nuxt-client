<template>

  <q-page class="q-pa-sm">
    <div class="row justify-center ">
      <div class="col-12 q-pa-md" style="max-width: 1080px;">
        <p class="text-h3">OGC API Jobs</p>
        <q-separator/>
         <br />
        <pre v-if="data">{{ formattedData }}</pre>
        <q-spinner v-else />
      </div>
    </div>
  </q-page>

</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRuntimeConfig } from '#imports'

const authStore = useAuthStore()
const config = useRuntimeConfig()
const data = ref(null)

const fetchData = async () => {
  try {
    const response = await fetch(`${config.public.NUXT_ZOO_BASEURL}/ogc-api/jobs`, {
      headers: {
        Authorization: `Bearer ${authStore.token.access_token}`
      }
    })
    if (response.ok) {
      data.value = await response.json()
    } else {
      console.error('Failed to fetch data:', response.statusText)
    }
  } catch (error) {
    console.error('Error fetching data:', error)
  }
}
onMounted(() => {
  fetchData()
})

const formattedData = computed(() => {
  return JSON.stringify(data.value, null, 2)
})
</script>