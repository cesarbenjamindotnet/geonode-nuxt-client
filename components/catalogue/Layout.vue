<template>

  <q-layout view="lHr Lpr fff" container :style="'height: ' + childLayoutHeight + 'px'">

    <q-header fixed>
      <q-toolbar class="bg-grey-2 text-grey-9">
        <q-btn dense @click="toggleLeftDrawer" no-caps color="primary" class="q-px-md">Filter
          <q-badge :color="filter.length ? 'green' : 'grey-7'" rounded floating label="199"/>
        </q-btn>

        <div class="q-px-sm">
          <q-btn dense no-caps class="q-px-md" color="grey-7">Order</q-btn>
        </div>

        <q-space/>
        <q-btn dense flat round :icon="viewMode == 'grid' ? 'mdi-view-grid' : 'mdi-view-list'"
               @click="toggleViewMode"/>

      </q-toolbar>
      <q-separator color="grey-5"/>
    </q-header>

    <q-page-container>
      <q-drawer v-model="leftDrawerOpen" side="left" bordered behavior="desktop" :width="leftDrawerWidth">
        <!-- drawer content -->
        <q-toolbar>
          <span class="text-grey-9"><q-icon name="mdi-filter" style="top: -1.5px"/></span>
          <span class="text-grey-9 text-bold">Filters</span>
          <q-space/>
          <div class="q-pr-sm">
            <q-btn flat dense @click="toggleLeftDrawer" no-caps class="q-px-sm" text-color="grey-8">
              Clear filters
            </q-btn>
          </div>
          <q-btn flat round dense size="sm" icon="close" @click="toggleLeftDrawer"/>
        </q-toolbar>
        <q-separator color="grey-2"/>
        <!-- <p>{{ ticked }}</p> -->
        <div class="row q-pa-sm">
          <div class="col-auto full-width">
            <div class="row q-pb-md">
              <CatalogueInputSearch v-model="search"/>
            </div>
            <div class="row">
              <b>Resources</b>
            </div>
            <div class="row q-pb-md" style="margin-top: 0">
              <q-tree
                  :nodes="filteredResourceTreeNodes"
                  v-model:ticked="tickedResourceTreeNodes"
                  node-key="value"
                  tick-strategy="leaf"
                  default-expand-all
                  no-connectors
              />
            </div>
            <div class="row">
              <b>Category</b>
            </div>
            <div class="row q-pb-md" style="margin-top: 4px;">
              <p>{{ catalogueStore.categoriesSelected }}</p>
              <q-select outlined dense v-model="catalogueStore.categoriesSelected"
                        :options="catalogueStore.categoriesList" label="Select categories"
                        use-chips clearable
                        option-value="key"
                        :option-label="(item) => item.label + ' (' + item.count + ')'"
                        emit-value
                        map-options
                        @clear="catalogueStore.categoriesSelected = []"
                        @update:model-value="updateQueryParams"
                        popup-no-route-dismiss
                        multiple use-input class="full-width" @virtual-scroll="handleCategoriesScroll"
                        :loading="categoriesLoading"/>
            </div>
            <div class="row">
              <b>Keyword</b>
            </div>
            <div class="row q-pb-md" style="margin-top: 4px;">
              <p>{{ catalogueStore.keywordsSelected }}</p>
              <q-select outlined dense v-model="catalogueStore.keywordsSelected" :options="catalogueStore.keywordsList"
                        label="Select keywords"
                        option-value="key" :option-label="(item) => item.label + ' (' + item.count + ')'" multiple
                        use-input use-chips clearable emit-value map-options
                        @clear="catalogueStore.keywordsSelected = []"
                        @update:model-value="updateQueryParams"
                        popup-no-route-dismiss
                        class="full-width" @virtual-scroll="handleKeywordsScroll" :loading="keywordsLoading"/>
            </div>
            <div class="row">
              <b>Region</b>
            </div>
            <div class="row q-pb-md" style="margin-top: 4px;">
              <p>{{ catalogueStore.regionsSelected }}</p>
              <q-select outlined dense v-model="catalogueStore.regionsSelected" :options="catalogueStore.regionsList"
                        label="Select keywords"
                        option-value="key" :option-label="(item) => item.label + ' (' + item.count + ')'" multiple
                        use-input use-chips clearable emit-value map-options
                        @clear="catalogueStore.regionsSelected = []"
                        @update:model-value="updateQueryParams"
                        popup-no-route-dismiss
                        class="full-width" @scroll="handleRegionsScroll" :loading="regionsLoading"/>
            </div>
            <div class="row">
              <b>Owner</b>
            </div>
            <div class="row q-pb-md" style="margin-top: 4px;">
              <p>{{ catalogueStore.ownersSelected }}</p>
              <q-select outlined dense v-model="catalogueStore.ownersSelected" :options="catalogueStore.ownersList"
                        label="Select keywords"
                        option-value="key" :option-label="(item) => item.label + ' (' + item.count + ')'" multiple
                        use-input use-chips clearable emit-value map-options
                        @clear="catalogueStore.ownersSelected = []"
                        @update:model-value="updateQueryParams"
                        popup-no-route-dismiss
                        class="full-width" @scroll="handleOwnersScroll" :loading="ownersLoading"/>
            </div>
            <div class="row">
              <b>Group</b>
            </div>
            <div class="row q-pb-md" style="margin-top: 4px;">
              <p>{{ catalogueStore.groupsSelected }}</p>
              <q-select outlined dense v-model="catalogueStore.groupsSelected" :options="catalogueStore.groupsList"
                        label="Select keywords"
                        option-value="key" :option-label="(item) => item.label + ' (' + item.count + ')'" multiple
                        use-input use-chips clearable emit-value map-options
                        @clear="catalogueStore.groupsSelected = []"
                        @update:model-value="updateQueryParams"
                        popup-no-route-dismiss
                        class="full-width" @scroll="handleGroupsScroll" :loading="groupsLoading"/>
            </div>
            <div class="row">
              <q-toggle
                  v-model="catalogueStore.filterUsingExtent"
                  checked-icon="mdi-map"
                  color="primary"
                  label="Extent"
                  unchecked-icon="clear"
              />
            </div>
            <div class="row" style="margin-top: 4px;">
              <CatalogueFilterExtentMap/>
            </div>
            <p><!-- end spacer --></p>

          </div>
        </div>
      </q-drawer>
      <q-page padding>


        <p>aaa</p>
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
import type {LocationQueryValue} from 'vue-router'
import type {FacetsResponse, ResourceTreeNode, ScrollEvent} from "@/interfaces/catalogue"

const catalogueStore = useCatalogueStore()
const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()
const $q = useQuasar()

const leftDrawerOpen = ref(false)

const search = ref<string | undefined>(undefined)
const tickedResourceTreeNodes = ref<LocationQueryValue[]>([])

const categoriesLoading = ref(false)
const categoriesPage = ref(0)
const categoriesPageSize = 20
const categoriesHasMore = ref(true)

const keywordsLoading = ref(false)
const keywordsPage = ref(0)
const keywordsPageSize = 20
const keywordsHasMore = ref(true)

const regionsLoading = ref(false)
const regionsPage = ref(0)
const regionsPageSize = 20
const regionsHasMore = ref(true)

const ownersLoading = ref(false)
const ownersPage = ref(0)
const ownersPageSize = 20
const ownersHasMore = ref(true)

const groupsLoading = ref(false)
const groupsPage = ref(0)
const groupsPageSize = 20
const groupsHasMore = ref(true)

const filter = ref([1])
const viewMode = ref("grid")


router.beforeEach((to, from, next) => {
  catalogueStore.hasPreviousRoute = !!from.name;
  next();
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

const resourceTreeNodes: ResourceTreeNode[] = [
  {value: 'my-resources', label: 'My resources', showIfUserIsLoggedIn: true},
  {value: 'favorite', label: 'Favorites', showIfUserIsLoggedIn: true},
  {value: 'featured', label: 'Featured'},
  {value: 'unpublished', label: 'Unpublished', showIfUserIsLoggedIn: true},
  {value: 'pending-approval', label: 'Pending approval', showIfUserIsLoggedIn: true},
  {
    value: 'dataset', label: 'Datasets', children: [
      {value: 'store-vector', label: 'Vector'},
      {value: 'store-raster', label: 'Raster'},
      {value: 'store-time-series', label: 'Time series'},
      {value: '3dtiles', label: '3D Tiles'},
      {value: 'tabular', label: 'Tabular'},
    ]
  },
  {value: 'map', label: 'Maps'},
  {value: 'mapviewer', label: 'Maps Viewers'},
  {value: 'document', label: 'Documents'},
  {value: 'geostory', label: 'GeoStories'},
  {value: 'dashboard', label: 'Dashboards'},
  {value: 'remote', label: 'Remote'},
]

// Computed para filtrar los nodos
const filteredResourceTreeNodes = computed(() => {
  // Función recursiva para filtrar nodos hijos también
  const filterNodes = (nodes: ResourceTreeNode[]) => {
    return nodes
      .filter((node) => {
        // Filtrar nodos principales según el estado de autenticación
        if (node.showIfUserIsLoggedIn && !authStore.user) {
          return false;
        }

        // Si tiene hijos, filtrarlos también de manera recursiva
        if (node.children) {
          node.children = filterNodes(node.children);
        }

        return true;
      });
  };

  return filterNodes(resourceTreeNodes);
});

const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

const toggleViewMode = () => {
  viewMode.value = viewMode.value === "grid" ? "list" : "grid"
}

// Función para actualizar los query params en la URL cuando se seleccionan nodos
const updateQueryParams = () => {
  const queryParams = {...route.query}
  console.log("updateQueryParams queryParams", queryParams)

  // Obtener los nodos hijos del tipo 'dataset'
  const datasetNode = resourceTreeNodes.find(node => node.value === 'dataset')
  let datasetChildren: any[] = []

  if (datasetNode && datasetNode.children) {
    datasetChildren = datasetNode.children.map(child => child.value)
  }

  let datasetSelected = false

  // Verificar si todos los hijos de 'dataset' están seleccionados
  const datasetTicked = tickedResourceTreeNodes.value.filter(item => datasetChildren.includes(item))
  const allDatasetChildrenSelected = datasetTicked.length === datasetChildren.length

  // Creamos los query params f para cada nodo ticked
  let filters: LocationQueryValue[]
  filters = tickedResourceTreeNodes.value.reduce<LocationQueryValue[]>((acc, item) => {
    if (datasetChildren.includes(item)) {
      datasetSelected = true
      if (!allDatasetChildrenSelected) {
        acc.push(item) // Agregamos cada hijo si no están todos seleccionados
      }
    } else {
      acc.push(item) // Para todos los nodos que no son hijos de dataset
    }
    return acc
  }, [])

  // Si hay al menos un hijo de dataset seleccionado o todos, agregamos 'dataset' si no está ya presente
  if (datasetSelected && !filters.includes('dataset')) {
    filters.push('dataset')
  }

  // Actualizamos el parámetro `f` solo si tiene valores seleccionados
  if (filters.length > 0) {
    queryParams.f = filters
  } else {
    delete queryParams.f
  }

  // Actualizamos el parámetro `q` con el valor del input de búsqueda
  if (search.value) {
    queryParams.q = search.value
  }

  if (!!catalogueStore.categoriesSelected && catalogueStore.categoriesSelected.length > 0) {
    queryParams[`filter{category.identifier.in}`] = catalogueStore.categoriesSelected
  } else {
    delete queryParams[`filter{category.identifier.in}`]
  }

  if (!!catalogueStore.keywordsSelected && catalogueStore.keywordsSelected.length > 0) {
    queryParams[`filter{keywords.slug.in}`] = catalogueStore.keywordsSelected
  } else {
    delete queryParams[`filter{keywords.slug.in}`]
  }

  if (!!catalogueStore.regionsSelected && catalogueStore.regionsSelected.length > 0) {
    queryParams[`filter{regions.code.in}`] = catalogueStore.regionsSelected
  } else {
    delete queryParams[`filter{regions.code.in}`]
  }

  if (!!catalogueStore.ownersSelected && catalogueStore.ownersSelected.length > 0) {
    queryParams[`filter{owner.pk.in}`] = catalogueStore.ownersSelected
  } else {
    delete queryParams[`filter{owner.pk.in}`]
  }

  if (catalogueStore.groupsSelected && catalogueStore.groupsSelected.length > 0) {
    queryParams[`filter{group.in}`] = catalogueStore.groupsSelected
  } else {
    delete queryParams[`filter{group.in}`]
  }

  if (catalogueStore.filterUsingExtent) {
    const [xmin, ymin, xmax, ymax] = catalogueStore.filterExtent
    queryParams.extent = `${xmin},${ymin},${xmax},${ymax}`
  } else {
    delete queryParams.extent
  }

  // Navegamos a la URL con los nuevos query params
  router.push({query: queryParams})
}

// Función para inicializar el estado de 'ticked' según los query params
const initializeTickedFromQuery = async () => {
  const queryParamsTicked: LocationQueryValue | LocationQueryValue[] | undefined = route.query.f
  const queryParamsSearch: string | undefined = typeof route.query.q === 'string' ? route.query.q : undefined;
  const queryParamsCategories: LocationQueryValue | LocationQueryValue[] | undefined = route.query['filter{category.identifier.in}']
  const queryParamsKeywords: LocationQueryValue | LocationQueryValue[] | undefined = route.query['filter{keywords.slug.in}']
  const queryParamsRegions: LocationQueryValue | LocationQueryValue[] | undefined = route.query['filter{regions.code.in}']
  const queryParamsOwners: LocationQueryValue | LocationQueryValue[] | undefined = route.query['filter{owner.pk.in}']
  const queryParamsGroups: LocationQueryValue | LocationQueryValue[] | undefined = route.query['filter{group.in}']
  const queryParamsExtent: LocationQueryValue | LocationQueryValue[] | undefined = route.query.extent

  if (Object.keys(route.query).length > 0) {
    leftDrawerOpen.value = true
  }

  if (queryParamsTicked) {
    console.log("queryParamsTicked", queryParamsTicked)
    const selectedValues = Array.isArray(queryParamsTicked) ? queryParamsTicked : [queryParamsTicked]
    tickedResourceTreeNodes.value = selectedValues.filter((value) => {
      return resourceTreeNodes.some(node => {
        if (node.value === value) return true
        if (node.children) {
          return node.children.some(child => child.value === value)
        }
        return false
      })
    })
  }

  if (queryParamsSearch) {
    search.value = queryParamsSearch
  }

  if (queryParamsCategories) {
    catalogueStore.categoriesSelected = Array.isArray(queryParamsCategories) ? queryParamsCategories : [queryParamsCategories]

    setTimeout(async () => {
      while (!catalogueStore.categoriesSelected.every(selectedKey =>
          catalogueStore.categoriesList.some(category => category.key === selectedKey))) {
        await fetchCategories()
        if (!categoriesHasMore.value) break
      }
    }, 300)
  }

  if (queryParamsKeywords) {
    catalogueStore.keywordsSelected = Array.isArray(queryParamsKeywords) ? queryParamsKeywords : [queryParamsKeywords]

    setTimeout(async () => {
      while (!catalogueStore.keywordsSelected.every(selectedKey =>
          catalogueStore.keywordsList.some(keyword => keyword.key === selectedKey))) {
        await fetchKeywords()
        if (!keywordsHasMore.value) break
      }
    }, 300)
  }

  if (queryParamsRegions) {
    catalogueStore.regionsSelected = Array.isArray(queryParamsRegions) ? queryParamsRegions : [queryParamsRegions]

    setTimeout(async () => {
      while (!catalogueStore.regionsSelected.every(selectedKey =>
          catalogueStore.regionsList.some(region => region.key === selectedKey))) {
        await fetchRegions()
        if (!regionsHasMore.value) break
      }
    }, 300)
  }

  if (queryParamsOwners) {
    catalogueStore.ownersSelected = Array.isArray(queryParamsOwners) ? queryParamsOwners : [queryParamsOwners]

    setTimeout(async () => {
      while (!catalogueStore.ownersSelected.every(selectedKey =>
          catalogueStore.ownersList.some(owner => owner.key === selectedKey))) {
        await fetchOwners()
        if (!ownersHasMore.value) break
      }
    }, 300)
  }

  if (queryParamsGroups) {
    catalogueStore.groupsSelected = Array.isArray(queryParamsGroups) ? queryParamsGroups : [queryParamsGroups]

    setTimeout(async () => {
      while (catalogueStore.groupsSelected.every(selectedKey =>
          catalogueStore.groupsList.some(group => group.key === selectedKey))) {
        await fetchGroups()
        if (!groupsHasMore.value) break
      }
    }, 300)
  }

  if (queryParamsExtent && typeof queryParamsExtent === 'string') {
    console.log("queryParamsExtent", queryParamsExtent)
    const [xmin, ymin, xmax, ymax] = queryParamsExtent.split(',')
    catalogueStore.filterUsingExtent = true
    catalogueStore.filterExtent = [parseFloat(xmin), parseFloat(ymin), parseFloat(xmax), parseFloat(ymax)]
    catalogueStore.filterExtentPolygon = [
      [
        [parseFloat(xmin), parseFloat(ymin)],
        [parseFloat(xmin), parseFloat(ymax)],
        [parseFloat(xmax), parseFloat(ymax)],
        [parseFloat(xmax), parseFloat(ymin)],
        [parseFloat(xmin), parseFloat(ymin)],
      ],
    ]
  }

  if (!queryParamsExtent) {
    setTimeout(() => {
      catalogueStore.filterUsingExtent = false
      catalogueStore.filterExtent = [-180, -90, 180, 90]
      console.log("catalogueStore.filterExtent", catalogueStore.filterExtent)
    }, 300)
  }

}

// Función para cargar categorías usando useFetch
const fetchCategories = async () => {
  if (categoriesLoading.value || !categoriesHasMore.value) return
  categoriesLoading.value = true

  try {
    const {data} = await useFetch<FacetsResponse>(`https://development.demo.geonode.org/api/v2/facets/category?page=${categoriesPage.value}&page_size=${categoriesPageSize}`);
    const {topics: {items = []} = {}} = data.value || {};
    if (items.length) {
      catalogueStore.categoriesList.push(...items)
      categoriesPage.value++
    } else {
      categoriesHasMore.value = false
    }
  } catch (error) {
    console.error('Error fetching categories:', error)
  } finally {
    categoriesLoading.value = false
  }
}

// Manejar el evento de scroll
const handleCategoriesScroll = ({to}: ScrollEvent) => {
  if (!categoriesLoading.value && categoriesHasMore.value && to === catalogueStore.categoriesList.length - 1) {
    fetchCategories();
  }
};

const fetchKeywords = async () => {
  if (keywordsLoading.value || !keywordsHasMore.value) return
  keywordsLoading.value = true

  try {
    const {data} = await useFetch<FacetsResponse>(`https://development.demo.geonode.org/api/v2/facets/keyword?page=${keywordsPage.value}&page_size=${keywordsPageSize}`);
    const {topics: {items = []} = {}} = data.value || {};
    if (items.length) {
      catalogueStore.keywordsList.push(...items)
      keywordsPage.value++
    } else {
      keywordsHasMore.value = false;
    }
  } catch (error) {
    console.error('Error fetching keywords:', error)
  } finally {
    keywordsLoading.value = false
  }
};

// Manejar el evento de scroll
const handleKeywordsScroll = ({to}: ScrollEvent) => {
  if (!keywordsLoading.value && keywordsHasMore.value && to === catalogueStore.keywordsList.length - 1) {
    fetchKeywords();
  }
}

const fetchRegions = async () => {
  if (regionsLoading.value || !regionsHasMore.value) return
  regionsLoading.value = true

  try {
    const {data} = await useFetch<FacetsResponse>(`https://development.demo.geonode.org/api/v2/facets/region?page=${regionsPage.value}&page_size=${regionsPageSize}`);
    const {topics: {items = []} = {}} = data.value || {};
    if (items.length) {
      catalogueStore.regionsList.push(...items)
      regionsPage.value++
    } else {
      regionsHasMore.value = false
    }
  } catch (error) {
    console.error('Error fetching regions:', error)
  } finally {
    regionsLoading.value = false
  }
}

const handleRegionsScroll = ({to}: ScrollEvent) => {
  if (!regionsLoading.value && regionsHasMore.value && to === catalogueStore.regionsList.length - 1) {
    fetchRegions();
  }
}

const fetchOwners = async () => {
  if (ownersLoading.value || !ownersHasMore.value) return;
  ownersLoading.value = true;

  try {
    const {data} = await useFetch<FacetsResponse>(`https://development.demo.geonode.org/api/v2/facets/owner?page=${ownersPage.value}&page_size=${ownersPageSize}`);
    const {topics: {items = []} = {}} = data.value || {};
    if (items.length) {
      catalogueStore.ownersList.push(...items)
      ownersPage.value++
    } else {
      ownersHasMore.value = false;
    }
  } catch (error) {
    console.error('Error fetching owners:', error);
  } finally {
    ownersLoading.value = false;
  }
}

const handleOwnersScroll = ({to}: ScrollEvent) => {
  if (!ownersLoading.value && ownersHasMore.value && to === catalogueStore.ownersList.length - 1) {
    fetchOwners();
  }
}

const fetchGroups = async () => {
  if (groupsLoading.value || !groupsHasMore.value) return;
  groupsLoading.value = true;

  try {
    const {data} = await useFetch<FacetsResponse>(`https://development.demo.geonode.org/api/v2/facets/group?page=${groupsPage.value}&page_size=${groupsPageSize}`);
    const {topics: {items = []} = {}} = data.value || {};
    if (items.length) {
      catalogueStore.groupsList.push(...items)
      groupsPage.value++
    } else {
      groupsHasMore.value = false;
    }
  } catch (error) {
    console.error('Error fetching groups:', error);
  } finally {
    groupsLoading.value = false;
  }
};

const handleGroupsScroll = ({to}: ScrollEvent) => {
  if (!groupsLoading.value && groupsHasMore.value && to === catalogueStore.groupsList.length - 1) {
    fetchGroups();
  }
}

watch(() => leftDrawerOpen.value, (value) => {
  if (value) {
    if (!catalogueStore.categoriesList.length) fetchCategories()
    if (!catalogueStore.keywordsList.length) fetchKeywords()
    if (!catalogueStore.regionsList.length) fetchRegions()
    if (!catalogueStore.ownersList.length) fetchOwners()
    if (!catalogueStore.groupsList.length) fetchGroups()
  }
})

onMounted(() => {
  setTimeout(() => {
    if (catalogueStore.hasPreviousRoute === false) {
      console.log("no previous route")

      initializeTickedFromQuery()

    } else {
      console.log("si previous route")
      catalogueStore.categoriesSelected = []
      catalogueStore.keywordsSelected = []
      catalogueStore.regionsSelected = []
      catalogueStore.ownersSelected = []
      catalogueStore.groupsSelected = []

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
  }, 100)
})

watch(
    [
      tickedResourceTreeNodes,
      search,
      () => catalogueStore.filterUsingExtent,
      () => catalogueStore.filterExtent
    ],
    () => {
      setTimeout(() => {
        updateQueryParams()
      }, 200)
    }
)

</script>
