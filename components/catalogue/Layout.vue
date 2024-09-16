<template>
  <q-layout view="lHr Lpr fff" container :style="'height: ' + childLayoutHeight + 'px'">
    <q-header fixed>
      <q-toolbar class="bg-grey-2 text-grey-9">
        <q-btn dense @click="toggleLeftDrawer" no-caps color="primary" class="q-px-md">Filter
          <q-badge v-if="hasQueryParams" color="green" rounded floating
                   :label="badgeFilterResultsNumber"/>
        </q-btn>

        <div class="q-px-sm">
          <q-btn dense no-caps class="q-px-md" color="grey-7">Order</q-btn>
        </div>

        <q-space/>
        <q-btn v-if="filterLoading" dense flat readonly no-caps disable class="no-pointer-events" loading>[]</q-btn>
        <q-btn v-else dense flat readonly no-caps disable class="no-pointer-events" :loading="filterLoading">
          {{ totalResources }} resources
        </q-btn>
        <q-btn dense flat round :icon="viewMode == 'grid' ? 'mdi-view-grid' : 'mdi-view-list'"
               @click="toggleViewMode"/>

      </q-toolbar>
      <q-separator color="grey-5"/>
    </q-header>

    <q-page-container>
      <q-drawer v-model="catalogueStore.leftDrawerOpen" side="left" bordered behavior="desktop"
                :width="leftDrawerWidth">
        <!-- drawer content -->
        <q-toolbar>
          <span class="text-grey-9"><q-icon name="mdi-filter" style="top: -1.5px"/></span>
          <span class="text-grey-9 text-bold">Filters</span>
          <q-space/>
          <div class="q-pr-sm">
            <q-btn flat dense @click="clearFilters" no-caps class="q-px-sm" text-color="grey-8">
              Clear filters
            </q-btn>
          </div>
          <q-btn flat round dense size="sm" icon="close" @click="toggleLeftDrawer"/>
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

      <q-page padding>
        <p>{{ urlQueryParams }}</p>
        <p>{{ resources }}</p>
        <p>aaa</p>
        <p>aaa</p>
        <p>aaa</p>
        <p>aaa</p>
        <p>aaa</p>
        <p>aaa</p>
        <p>aaa</p>
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

const filter = ref([1])
const viewMode = ref("grid")

const pageSize = ref(24)
const totalResources = ref<number>(0)
const resources = ref<any[]>([])
const urlQueryParams = ref<string>('')
const hasQueryParams = ref<boolean>(false)
const filterLoading = ref<boolean>(false)

let timeout;

router.beforeEach((to, from, next) => {
  catalogueStore.hasPreviousRoute = !!from.name
    next()
});

router.afterEach((to, from) => {
  console.log("afterEach to", to)
  console.log("afterEach from", from)
  clearTimeout(timeout);

  timeout = setTimeout(async () => {
    console.log("afterEach catalogueStore.filterLoading", filterLoading.value)

    if (!filterLoading.value) {
      console.log("afterEach no loading")

      const validResourceTypes = ["dataset", "map", "document", "geostory", "dashboard"]
      let resourceTypeFilter = ''

      if (to.params.slug && validResourceTypes.includes(<string>to.params.slug)) {
        resourceTypeFilter = `&filter{resource_type.in}=${to.params.slug}`
      }

      let queryParams: string | undefined = ''
      urlQueryParams.value = ''
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
        urlQueryParams.value = `${resourceTypeFilter}${queryParams}&page_size=${pageSize.value}`
      }

      hasQueryParams.value = Object.keys(route.query).length > 0;

      const url = `https://development.demo.geonode.org/api/v2/resources?api_preset=catalog_list&filter{metadata_only}=false${urlQueryParams.value}`

      try {
        filterLoading.value = true
        $q.loadingBar.start()
        const {data} = await useFetch(url, {headers: headers})
        console.log("data", data.value)
        totalResources.value = data.value.total
        resources.value = data.value.resources
        $q.loadingBar.stop()
        filterLoading.value = false
        console.log("finally filterLoading.value", filterLoading.value)
      } catch (error) {
        console.error('Error fetching data:', error)

      } finally {
        $q.loadingBar.stop()
        filterLoading.value = false
        console.log("finally catalogueStore.filterLoading", filterLoading.value)
      }
    }

  }, 1200);

});


const childLayoutHeight = computed(() => {
  return $q.screen.height - 117
})

const leftDrawerWidth = computed(() => {
  if ($q.screen.width < 400 && $q.screen.width >= 300) {
    return 300
  } else if ($q.screen.width < 300) {
    return $q.screen.width
  } else {
    return 400
  }
})

const clearFilters = () => {
  catalogueStore.hasPreviousRoute = false
  router.replace({path: route.path, query: {}})
  console.log("clearFilters")
}

const toggleLeftDrawer = () => {
  catalogueStore.leftDrawerOpen = !catalogueStore.leftDrawerOpen
}

const toggleViewMode = () => {
  viewMode.value = viewMode.value === "grid" ? "list" : "grid"
}

const badgeFilterResultsNumber = computed(() => {
  console.log("totalResources.value", totalResources.value)
    console.log("catalogueStore.filterLoading", filterLoading.value)
  if (totalResources.value && !filterLoading.value) {

    return totalResources.value.toString()
  }
  return "·"
})

onMounted(() => {
  if (Object.keys(route.query).length > 0) {
    setTimeout(() => {
      catalogueStore.leftDrawerOpen = true
    }, 800)
  }
})

watch(
  () => urlQueryParams.value, // Específica que quieres observar el valor del ref
  (newVal) => {
    console.log("urlQueryParams", newVal); // newVal será el valor actualizado
  }
)

</script>
