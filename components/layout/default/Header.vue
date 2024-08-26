<template>
  <q-header reveal bordered>

    <q-toolbar class="bg-white text-grey-10 justify-between">
      <div class="col-auto">
        <div class="row">

          <div class="col-auto">
            <NuxtLink to="/">
              <q-avatar>
                <img width="128" src="https://cdn.quasar.dev/logo-v2/svg/logo-dark.svg">
              </q-avatar>
            </NuxtLink>
          </div>
          <div class="col-auto q-pl-xs q-pt-xs" v-show="!isSmallScreen">
            <span class="q-pl-xs text-h6 ">
              <NuxtLink to="/" class="text-grey-10" style="text-decoration: none;">
                Geonode
              </NuxtLink>
            </span>
          </div>
        </div>
      </div>
      <div :class="['q-px-sm', isSmallScreen ? '' : 'col-5'] ">
        <q-input dense v-model="search" outlined type="search" :loading="loadingState">
          <template v-slot:prepend>
            <q-icon name="search"/>
          </template>
        </q-input>
      </div>
      <div class="col-auto">
        <div class="row">
          <q-btn dense flat icon="mdi-dots-vertical" @click="showHeaderMenu = true"></q-btn>
          <div class="q-pt-sm" style="padding-top: 36px;">
            <LayoutSharedHeaderMenu :show="showHeaderMenu" @hide="showHeaderMenu = false"/>
          </div>
          <q-btn v-if="!isLoggedUser && isSmallScreen" class="q-px-sm" dense no-caps color="accent" round
                 icon="mdi-account-circle"/>
          <q-btn v-else-if="!isLoggedUser" class="q-px-sm" dense no-caps color="accent" label="Acceder"/>
          <q-btn v-else rounded dense flat>
            <q-avatar>
              <img :src="gravatarUrl">
            </q-avatar>
          </q-btn>
        </div>
      </div>
    </q-toolbar>

    <div v-if="route.path === '/'"
         class="row bg-primary text-white justify-center q-pa-sm content-center bg-light-blue-10">
      <div class="col-auto content-center text-center" style="min-height: 258px;">
        <p class="text-h1 q-pt-md">Geonode</p>
        <p class="text-h6">Sharing geospatial data and maps.</p>
      </div>
    </div>

    <div class="row">
      <div class="col-auto">
        <q-tabs dense align="left">
          <q-route-tab no-caps to="/all" label="All Resources"/>
          <q-route-tab no-caps to="/otra" label="Datasets"/>
          <q-route-tab no-caps to="/prueba" label="Maps"/>
          <q-route-tab no-caps to="/otra" label="Documents"/>
          <q-route-tab no-caps to="/prueba" label="GeoStories"/>
          <q-route-tab no-caps to="/otra" label="Dashboards"/>
        </q-tabs>
      </div>
      <q-space/>
      <div class="col-auto">
        <q-tabs dense align="left">
          <q-tab no-caps label="English">
          </q-tab>
          <q-route-tab no-caps to="/about" label="About"/>
        </q-tabs>
      </div>
    </div>
  </q-header>
</template>

<script setup lang="ts">
const showHeaderMenu = ref(false)
const isLoggedUser = ref(false) // TODO: Implement user authentication and pinia storage of user data
const loggedUser = ref({email: 'mathereall@gmail.com'}) // TODO: Implement user authentication and pinia storage of user data

const loadingState = ref(true)
const search = ref('')
const route = useRoute()

const $q = useQuasar()
const stringToMD5 = useStringToMD5()

const gravatarUrl = ref('https://www.gravatar.com/avatar/46d229b033af06a191ff2267bca9ae56/')

onMounted(() => {
  if (!!isLoggedUser.value && loggedUser.value.email) {
    gravatarUrl.value = `https://www.gravatar.com/avatar/${stringToMD5(loggedUser.value.email)}/`
  }
})

const isSmallScreen = computed(() => {
  return $q.screen.width <= $q.screen.sizes.sm
})

</script>

<style scoped>

</style>

