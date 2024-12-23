<template>
  <q-header bordered>
    <q-toolbar class="bg-white text-grey-10 justify-between">
      <div class="col-auto">
        <div class="row">

          <div class="col-auto">
            <NuxtLink to="/">
              <q-avatar square >
                <q-img src="https://zoo-project.org/img/zoo-sun-logo-big.png" width="128"/>
              </q-avatar>

            </NuxtLink>
          </div>
          <div class="col-auto q-pl-xs q-pt-xs" v-show="!isSmallScreen">
            <span class="q-pl-xs text-h6 ">
              <NuxtLink to="/" class="text-grey-10" style="text-decoration: none;">
                Zoo-Project
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
          <div class="q-pt-sm" style="padding-top: 36px;">
            <LayoutSharedHeaderMenu :show="showHeaderMenu" @hide="showHeaderMenu = false"/>
          </div>
          <div v-if="!authStore.user">
            <q-btn v-if="isSmallScreen" class="q-px-sm" dense no-caps color="accent" round
                   icon="mdi-account-circle" href="/api/auth/signin"/>
            <q-btn v-else-if="!isLoggedUser" class="q-px-md" no-caps color="accent" label="Acceder"
                   href="/api/auth/signin"/>
          </div>
          <div v-else>
            <q-btn rounded dense flat>
              <q-avatar>
                <img :src="gravatarUrl">
              </q-avatar>
            </q-btn>
            <q-menu>
              <q-list dense>
                <q-item clickable v-close-popup class="q-px-lg">
                  <q-item-section class="q-px-sm">Profile</q-item-section>
                </q-item>
                <q-item clickable v-close-popup>
                  <q-item-section class="q-px-sm">Recent activity</q-item-section>
                </q-item>
                <q-item clickable v-close-popup>
                  <q-item-section class="q-px-sm">Favorites</q-item-section>
                </q-item>
                <q-item clickable v-close-popup>
                  <q-item-section class="q-px-sm">Inbox</q-item-section>
                </q-item>
                <q-separator/>
                <q-item clickable v-close-popup :href="geonodeAdminUrl" target="_blank">
                  <q-item-section class="q-px-sm">Administration</q-item-section>
                </q-item>

                <q-item clickable v-close-popup :href="geoserverUrl" target="_blank">
                  <q-item-section class="q-px-sm">GeoServer</q-item-section>
                </q-item>
                <q-separator/>
                <q-item clickable v-close-popup to="/help">
                  <q-item-section class="q-px-sm">Help</q-item-section>
                </q-item>
                <q-separator/>
                <q-item clickable v-close-popup to="/logout">
                  <q-item-section class="q-px-sm">Logout</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </div>
        </div>
      </div>
    </q-toolbar>

    <div class="row">
      <div class="col-auto">
        <q-tabs dense align="left">
          <q-route-tab no-caps to="/link/one" label="One link"/>
          <q-route-tab no-caps to="/link/two" label="Another"/>
        </q-tabs>
      </div>
      <q-space/>
      <div class="col-auto">
        <q-tabs dense align="left">
          <q-route-tab v-if="authStore.user" no-caps to="/ogc-api" label="OGC API"/>
          <q-route-tab v-if="authStore.user" no-caps to="/jobs" label="Jobs"/>
          <q-route-tab no-caps to="/about" label="About"/>
        </q-tabs>
      </div>
    </div>
  </q-header>
</template>

<script setup lang="ts">
const config = useRuntimeConfig()
const showHeaderMenu = ref(false)
const geoserverUrl = config.public.GEOSERVER_BASEURL
const geonodeAdminUrl = `${config.public.GEONODE_BASEURL}/${config.public.GEONODE_BASE_URL}/${config.public.GEONODE_BASE_URL}`
const isLoggedUser = ref(false) // TODO: Implement user authentication and pinia storage of user data
const loggedUser = ref({email: 'mathereall@gmail.com'}) // TODO: Implement user authentication and pinia storage of user data

const authStore = useAuthStore()

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
  console.log("process.env", process.env)
})

const isSmallScreen = computed(() => {
  return $q.screen.width <= $q.screen.sizes.sm
})

</script>

<style scoped>

</style>

