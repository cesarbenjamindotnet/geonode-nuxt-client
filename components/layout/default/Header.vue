<template>
  <q-header reveal bordered>

    <q-toolbar class="bg-white text-grey-10 justify-between">
      <div class="col-auto">
        <div class="row">

          <div class="col-auto">
            <NuxtLink to="/">
              <q-avatar>
                <img src="https://cdn.quasar.dev/logo-v2/svg/logo-dark.svg">
              </q-avatar>
            </NuxtLink>
          </div>
          <div class="col-auto q-pl-xs q-pt-xs" v-show="$q.screen.width >= $q.screen.sizes.sm">
            <span class="q-pl-xs text-h6 ">
              <NuxtLink to="/" class="text-grey-10" style="text-decoration: none;">
                GeoNode
              </NuxtLink>
            </span>
          </div>

        </div>
      </div>
      <div :class="['q-px-sm', $q.screen.width >= $q.screen.sizes.sm ? 'col-5' : ''] ">
        <q-input dense v-model="search" outlined type="search" :loading="loadingState">
          <template v-slot:prepend>
            <q-icon name="search"/>
          </template>
        </q-input>
      </div>
      <div class="col-auto">
        <div class="row">
          <q-btn dense flat round icon="mdi-dots-vertical" @click="showHeaderMenu = true"></q-btn>
          <div class="q-pt-sm" style="padding-top: 36px;">
            <LayoutSharedHeaderMenu :show="showHeaderMenu" @hide="showHeaderMenu = false" />
          </div>
          <q-btn v-if="isMounted && $q.screen.width <= $q.screen.sizes.sm" class="q-px-sm" dense no-caps color="accent" round
                 icon="mdi-account-circle"/>
          <q-btn v-else-if="isMounted" class="q-px-sm" dense no-caps color="accent" label="Acceder"/>
        </div>
      </div>
    </q-toolbar>

    <div v-if="route.path === '/'"
         class="row bg-primary text-white justify-center q-pa-sm content-center bg-light-blue-10">
      <div class="col-auto content-center text-center" style="min-height: 258px;">
        <p class="text-h1 q-pt-md">GeoNode</p>
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

          <q-tab no-caps @click="menuVisible = true" label="English" href="#"
                 :active-class="['.no-indicator', '.q-tab__indicator']">
          </q-tab>
          <div class="q-pt-sm" style="padding-top: 36px;">
            <q-menu v-model="menuVisible" anchor="bottom left" self="top left">
              <q-list>
                <q-item clickable v-close-popup @click="menuAction('Settings')">
                  <q-item-section class="q-px-md">Español</q-item-section>
                </q-item>
                <q-item clickable v-close-popup @click="menuAction('Help')">
                  <q-item-section>Deutsch</q-item-section>
                </q-item>
                <q-item clickable v-close-popup @click="menuAction('Logout')">
                  <q-item-section>Français</q-item-section>
                </q-item>
                <q-item clickable v-close-popup @click="menuAction('Logout')">
                  <q-item-section>Italiano</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </div>
          <q-route-tab no-caps to="/prueba" label="About">

          </q-route-tab>

        </q-tabs>


      </div>
    </div>
  </q-header>
</template>

<script setup lang="ts">

const showHeaderMenu = ref(false)

const menuVisible = ref(false)
const loadingState = ref(true)
const isMounted = ref(false)
const search = ref('')
const route = useRoute()

const menuAction = (action: string) => {
  console.log(action)
}

onMounted(() => {
  isMounted.value = true
})

</script>

<style lang="scss" scoped>
.no-indicator .q-tab__indicator {
  display: none;
}
</style>

