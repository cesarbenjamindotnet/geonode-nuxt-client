<template>
  <q-drawer v-model="catalogueStore.showLeftDrawer" side="left" bordered
            behavior="desktop"
            :width="leftDrawerWidth">
    <q-toolbar>
      <span class="text-grey-9"><q-icon name="mdi-filter" style="top: -1.5px"/></span>
      <span class="text-grey-9 text-bold">Filters</span>
      <q-space/>
      <div class="q-pr-sm">
        <q-btn v-if="catalogueStore.hasQueryParams" flat dense @click="catalogueStore.clearFilters(router, route)" no-caps
               class="q-px-sm" text-color="grey-8">
          Clear filters
        </q-btn>
      </div>
      <q-btn flat dense size="md" icon="close" @click="toggleLeftDrawer"/>
    </q-toolbar>
    <q-separator color="grey-2"/>

    <div class="row q-pa-sm">
      <div class="col-auto full-width">

        <CatalogueInputSearch/>

        <CatalogueTreeResources/>

        <CatalogueSelectCategories/>

        <CatalogueSelectKeywords/>

        <CatalogueSelectRegions/>

        <CatalogueSelectOwners/>

        <CatalogueSelectGroups/>

        <CatalogueDateFrom/>

        <CatalogueDateTo/>

        <CatalogueMapExtent/>

        <p><!-- end spacer --></p>
      </div>
    </div>
  </q-drawer>
</template>

<script setup lang="ts">
const catalogueStore = useCatalogueStore()
const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()
const $q = useQuasar()

const toggleLeftDrawer = () => {
  catalogueStore.showLeftDrawer = !catalogueStore.showLeftDrawer
  if (catalogueStore.showLeftDrawer) {
    catalogueStore.showResourceDetailDrawer = false
  }
}

const leftDrawerWidth = computed(() => {
  if ($q.screen.width < 400 && $q.screen.width >= 300) {
    return 300
  } else if ($q.screen.width < 300) {
    return $q.screen.width
  } else {
    return 400
  }
})
</script>

<style scoped>

</style>