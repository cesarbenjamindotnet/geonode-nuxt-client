<template>
  <template>
    <q-layout view="lHh lpR fFf">

      <q-header reveal bordered height-hint="98">
        <q-toolbar class="bg-white text-grey-10 justify-between">

          <div class="col-auto">
            <div class="row">
              <div class="col-auto">
                <q-avatar>
                  <img src="https://cdn.quasar.dev/logo-v2/svg/logo-dark.svg">
                </q-avatar>
              </div>
              <div class="col-auto q-pl-xs q-pt-xs" v-show="$q.screen.width >= $q.screen.sizes.sm">
                <span class="q-pl-sm text-h6 ">GeoNode</span>
              </div>
            </div>
          </div>
          <div class="col-6">
            <q-input dense v-model="search" outlined type="search" :loading="loadingState">
              <template v-slot:prepend>
                <q-icon name="search"/>
              </template>
            </q-input>
          </div>
          <div class="col-auto q-gutter-sm">
            <q-btn class="q-px-sm" dense no-caps color="purple">Acceder</q-btn>
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
              <q-route-tab no-caps to="/prueba" label="All Resources"/>
              <q-route-tab no-caps to="/" label="Datasets"/>
              <q-route-tab no-caps to="/prueba" label="Maps"/>
              <q-route-tab no-caps to="/" label="Documents"/>
              <q-route-tab no-caps to="/prueba" label="GeoStories"/>
              <q-route-tab no-caps to="/" label="Dashboards"/>
            </q-tabs>
          </div>
          <q-space/>
          <div class="col-auto">
            <q-tabs dense align="left">

              <q-tab no-caps @click="menuVisible = true" label="English" href="#"/>
              <q-route-tab no-caps to="/prueba" label="About">

                <q-menu v-model="menuVisible" anchor="bottom left" self="top right">
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
              </q-route-tab>
            </q-tabs>
          </div>
        </div>
      </q-header>

      <q-page-container>
        <slot/>
      </q-page-container>

      <q-footer bordered class="bg-white text-grey-9 q-py-xs q-px-sm">

        <div class="row justify-center q-gutter-lg">
          <div class="col-auto"><a href="https://geonode.org" target="_blank"
                                   style="text-decoration: none;">geonode.org</a></div>
          <div class="col-auto"><a href="https://stable.demo.geonode.org/developer/" target="_blank"
                                   style="text-decoration: none;">Developers</a></div>
          <div class="col-auto">
            <NuxtLink to="/about" style="text-decoration: none;">About</NuxtLink>
          </div>
        </div>
      </q-footer>

    </q-layout>
  </template>

</template>

<script setup lang="ts">
const menuVisible = ref(false)
const loadingState = ref(true)
const search = ref('')
const route = useRoute()
</script>

<style scoped>

</style>