<template>
  <q-layout view="lHr LpR fff" container :style="'height: ' + childLayoutHeight + 'px'">
    <q-header fixed class="bg-grey-2 text-grey-9">
      <q-toolbar class="q-px-sm bg-grey-2 text-grey-9" style="max-width: 1460px; margin: 0 auto;">
        <div class="q-px-sm">
          <q-btn dense @click="toggleLeftDrawer" no-caps color="primary" class="q-px-md">Filter
            <q-badge v-if="catalogueStore.hasQueryParams" color="green" rounded floating
                     :label="badgeFilterResultsNumber"/>
          </q-btn>
        </div>
        <div class="q-pr-sm">
          <q-btn dense no-caps class="q-px-md" color="grey-7">Order</q-btn>
        </div>

        <q-space/>
        <q-btn v-if="catalogueStore.filterLoading" dense flat readonly no-caps disable class="no-pointer-events"
               loading>[]
        </q-btn>
        <q-btn v-else dense flat readonly no-caps disable class="no-pointer-events"
               :loading="catalogueStore.filterLoading">
          {{ resourcesCount }} resources found
        </q-btn>
        <q-btn dense flat round :icon="viewMode == 'grid' ? 'mdi-view-grid' : 'mdi-view-list'"
               @click="toggleViewMode"/>

      </q-toolbar>
      <q-separator color="grey-5"/>
    </q-header>

    <q-page-container>
      <CatalogueFilterDrawer />
      <CatalogueResourceDetailDrawer />

      <q-page>

        <CatalogueResourceGrid v-if="viewMode==='grid'"/>
        <p v-else>{{ viewMode }}</p>

        <!--
        <p>{{ urlQueryParams }}</p>
        <p>{{ catalogueStore.resources }}</p>
        -->

      </q-page>
    </q-page-container>
  </q-layout>

</template>

<script setup lang="ts">

const catalogueStore = useCatalogueStore()
const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()
const $q = useQuasar()

const viewMode = ref("grid")

const pageSize = ref(24)
const resourcesCount = ref<number>(0)
const urlQueryParams = ref<string>('')

let timeout;

router.beforeEach((to, from, next) => {
  catalogueStore.hasPreviousRoute = !!from.name
  console.log("beforeEach to path", to.path)
  console.log("beforeEach from path", from.path)
  if (to.path !== from.path) {
    catalogueStore.resources = []
  }
  next()
});

router.afterEach((to, from) => {
  clearTimeout(timeout);

  timeout = setTimeout(async () => {
    if (!catalogueStore.filterLoading && ["catalogue", "catalogue-slug"].includes(to.name as string)) {
      const validResourceTypes = ["dataset", "map", "document", "geostory", "dashboard"]
      let resourceTypeFilter = ''
      urlQueryParams.value = ''

      if (to.params.slug && validResourceTypes.includes(<string>to.params.slug)) {
        resourceTypeFilter = `&filter{resource_type.in}=${to.params.slug}`
      }

      let queryParams: string | undefined = ''

      if (to.fullPath.toString().includes('?')) {
        queryParams = '&' + to.fullPath.toString().split('?').pop()
        queryParams = queryParams.replace("f=my-resources", "filter{owner.pk}=1314")
        queryParams = queryParams.replace("f=favorite", "favorite=true")
        queryParams = queryParams.replace("f=featured", "filter{featured}=true")
        queryParams = queryParams.replace("f=unpublished", "filter{is_published}=false")
        queryParams = queryParams.replace("f=pending-approval", "filter{is_approved}=false")
        queryParams = queryParams.replace("f=pending-approval", "filter{is_approved}=false")
        queryParams = queryParams.replace("f=dataset", "filter{resource_type.in}=dataset")
        queryParams = queryParams.replace("f=store-vector", "filter{subtype.in}=vector")
        queryParams = queryParams.replace("f=store-raster", "filter{subtype.in}=raster")
        queryParams = queryParams.replace("f=store-time-series", "filter{subtype.in}=vector_time")
        queryParams = queryParams.replace("f=3dtiles", "filter{subtype.in}=3dtiles")
        queryParams = queryParams.replace("f=tabular", "filter{subtype.in}=tabular")
        queryParams = queryParams.replace("f=map", "filter{resource_type.in}=map")
        queryParams = queryParams.replace("f=mapviewer", "filter{resource_type.in}=mapviewer")
        queryParams = queryParams.replace("f=document", "filter{resource_type.in}=document")
        queryParams = queryParams.replace("f=geostory", "filter{resource_type.in}=geostory")
        queryParams = queryParams.replace("f=dashboard", "filter{resource_type.in}=dashboard")
        queryParams = queryParams.replace("f=remote", "filter{resource_type.in}=remote")
      }

      const headers = {}

      if (`${resourceTypeFilter}${queryParams}` !== '') {
        urlQueryParams.value = `${resourceTypeFilter}${queryParams}`
      }

      catalogueStore.hasQueryParams = Object.keys(route.query).length > 0;

      const url = `https://development.demo.geonode.org/api/v2/resources?api_preset=catalog_list&filter{metadata_only}=false&page_size=${pageSize.value}${urlQueryParams.value}`

      try {
        catalogueStore.filterLoading = true
        $q.loadingBar.start()
        const {data} = await useFetch(url, {headers: headers})
        console.log("data", data.value)
        resourcesCount.value = data.value.total
        catalogueStore.resources = data.value.resources
        $q.loadingBar.stop()
        catalogueStore.filterLoading = false
        console.log("tried filterLoading.value", catalogueStore.filterLoading)

      } catch (error) {
        console.error('Error fetching data:', error)

      } finally {
        $q.loadingBar.stop()
        catalogueStore.filterLoading = false
        console.log("finally catalogueStore.filterLoading", catalogueStore.filterLoading)
      }
    }
  }, 1200);

});


const childLayoutHeight = computed(() => {
  return $q.screen.height - 117
})

const toggleLeftDrawer = () => {
  catalogueStore.showLeftDrawer = !catalogueStore.showLeftDrawer
  if (catalogueStore.showLeftDrawer) {
    catalogueStore.showResourceDetailDrawer = false
  }
}

const toggleViewMode = () => {
  viewMode.value = viewMode.value === "grid" ? "list" : "grid"
}

const badgeFilterResultsNumber = computed(() => {
  // Si filterLoading es true, devolver el punto "·"
  if (catalogueStore.filterLoading) {
    return "·";
  }

  // Si resourcesCount.value es 0 o más y filterLoading es false, devolver el valor de resourcesCount
  if (resourcesCount.value >= 0) {
    return resourcesCount.value.toString();
  }

  // Opcionalmente, puedes manejar el caso en que resourcesCount sea negativo (si es necesario)
  return "·";
});

onMounted(() => {
  catalogueStore.showResourceDetailDrawer = false
  if (Object.keys(route.query).length > 0) {
    setTimeout(() => {
      catalogueStore.showLeftDrawer = true
    }, 800)
  }
})

</script>

<style lang="scss" scoped>

</style>