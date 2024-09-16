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
          {{ resourcesCount }} resources found
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
            <q-btn v-if="hasQueryParams" flat dense @click="clearFilters" no-caps class="q-px-sm" text-color="grey-8">
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
        <div class="row q-col-gutter-md">
          <div
              v-for="(item, index) in resources"
              :key="index"
              class="col-xs-12 col-sm-6 col-md-4 col-lg-3"
          >
            <q-card>

                <q-img
                    :src="item.thumbnail_url"
                    :alt="item.title"
                    basic
                />

              <q-card-section>
                <div class="text">{{ item.title }}</div>
              </q-card-section>
              <q-card-section>
                {{ item.description }}
              </q-card-section>
            </q-card>
          </div>
        </div>

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
const resourcesCount = ref<number>(0)
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
  clearTimeout(timeout);

  timeout = setTimeout(async () => {
    if (!filterLoading.value && ["catalogue", "catalogue-slug"].includes(to.name as string)) {
      console.log("to.path.name", to.name)
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
        urlQueryParams.value = `${resourceTypeFilter}${queryParams}&page_size=${pageSize.value}`
      }

      hasQueryParams.value = Object.keys(route.query).length > 0;

      const url = `https://development.demo.geonode.org/api/v2/resources?api_preset=catalog_list&filter{metadata_only}=false${urlQueryParams.value}`

      try {
        filterLoading.value = true
        $q.loadingBar.start()
        const {data} = await useFetch(url, {headers: headers})
        console.log("data", data.value)
        resourcesCount.value = data.value.total
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
  if (1 === 1) {
    catalogueStore.filterInputSearch = undefined
    catalogueStore.resourceTreeNodesSelected = []
    catalogueStore.categoriesSelected = []
    catalogueStore.keywordsSelected = []
    catalogueStore.regionsSelected = []
    catalogueStore.ownersSelected = []
    catalogueStore.groupsSelected = []
    catalogueStore.filterInputDateFrom = undefined
    catalogueStore.filterInputDateTo = undefined
    catalogueStore.filterUsingExtent = false
    catalogueStore.filterExtent = [-180, -90, 180, 90]
    catalogueStore.filterExtentPolygon = [
      [
        [-180, -90],
        [-180, 90],
        [180, 90],
        [180, -90],
        [-180, -90],
      ]
    ]
  }
  router.replace({path: route.path, query: {}})
  setTimeout(() => {
    console.log("clearFilters")
    router.push(route.path)
  }, 100)
}

const toggleLeftDrawer = () => {
  catalogueStore.leftDrawerOpen = !catalogueStore.leftDrawerOpen
}

const toggleViewMode = () => {
  viewMode.value = viewMode.value === "grid" ? "list" : "grid"
}

const badgeFilterResultsNumber = computed(() => {
  // Si filterLoading es true, devolver el punto "·"
  if (filterLoading.value) {
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
