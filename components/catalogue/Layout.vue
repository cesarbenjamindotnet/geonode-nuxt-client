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
                  :nodes="resource_tree_nodes"
                  v-model:ticked="ticked"
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
              <p>{{ categoriesSelected }}</p>
              <q-select outlined dense v-model="categoriesSelected" :options="categoriesList" label="Select categories"
                        use-chips clearable
                        option-value="key"
                        :option-label="(item) => item.label + ' (' + item.count + ')'"
                        emit-value
                        map-options
                        multiple use-input class="full-width" @virtual-scroll="handleCategoriesScroll"
                        :loading="categoriesLoading"/>
            </div>
            <div class="row">
              <b>Keyword</b>
            </div>
            <div class="row q-pb-md" style="margin-top: 4px;">
              <p>{{ keywordsSelected }}</p>
              <q-select outlined dense v-model="keywordsSelected" :options="keywordsList" label="Select keywords"
                        option-value="key" :option-label="(item) => item.label + ' (' + item.count + ')'" multiple
                        use-input use-chips clearable emit-value map-options
                        class="full-width" @virtual-scroll="handleKeywordsScroll" :loading="keywordsLoading"/>
            </div>
            <div class="row">
              <b>Region</b>
            </div>
            <div class="row q-pb-md" style="margin-top: 4px;">
              <p>{{ regionsSelected }}</p>
              <q-select outlined dense v-model="regionsSelected" :options="regionsList" label="Select keywords"
                        option-value="key" :option-label="(item) => item.label + ' (' + item.count + ')'" multiple
                        use-input use-chips clearable emit-value map-options
                        class="full-width" @scroll="handleRegionsScroll" :loading="regionsLoading"/>
            </div>
            <div class="row">
              <b>Owner</b>
            </div>
            <div class="row q-pb-md" style="margin-top: 4px;">
              <p>{{ ownersSelected }}</p>
              <q-select outlined dense v-model="ownersSelected" :options="ownersList" label="Select keywords"
                        option-value="key" :option-label="(item) => item.label + ' (' + item.count + ')'" multiple
                        use-input use-chips clearable emit-value map-options
                        class="full-width" @scroll="handleOwnersScroll" :loading="ownersLoading"/>
            </div>
            <div class="row">
              <b>Group</b>
            </div>
            <div class="row q-pb-md" style="margin-top: 4px;">
              <p>{{ groupsSelected }}</p>
              <q-select outlined dense v-model="groupsSelected" :options="groupsList" label="Select keywords"
                        option-value="key" :option-label="(item) => item.label + ' (' + item.count + ')'" multiple
                        use-input use-chips clearable emit-value map-options
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
import type {LocationQueryValue} from 'vue-router';
import type {FacetItem, ScrollEvent} from "@/interfaces/catalogue";
import type {FacetsResponse} from "@/interfaces/catalogue";

const catalogueStore = useCatalogueStore()
const router = useRouter()
const route = useRoute()
const $q = useQuasar()

const leftDrawerOpen = ref(false)

const search = ref<string | undefined>(undefined)
const ticked = ref<LocationQueryValue[]>([])

const categoriesList = ref<FacetItem[]>([]);
const categoriesSelected = ref<LocationQueryValue[]>([]);
const categoriesLoading = ref(false);
const categoriesPage = ref(0);
const categoriesPageSize = 20;
const categoriesHasMore = ref(true);

const keywordsList = ref<FacetItem[]>([]);
const keywordsSelected = ref<LocationQueryValue[]>([]);
const keywordsLoading = ref(false);
const keywordsPage = ref(0);
const keywordsPageSize = 20;
const keywordsHasMore = ref(true);

const regionsList = ref<FacetItem[]>([]);
const regionsSelected = ref<LocationQueryValue[]>([]);
const regionsLoading = ref(false);
const regionsPage = ref(0);
const regionsPageSize = 20;
const regionsHasMore = ref(true);

const ownersList = ref<FacetItem[]>([]);
const ownersSelected = ref<LocationQueryValue[]>([]);
const ownersLoading = ref(false);
const ownersPage = ref(0);
const ownersPageSize = 20;
const ownersHasMore = ref(true);

const groupsList = ref<FacetItem[]>([]);
const groupsSelected = ref<LocationQueryValue[]>([]);
const groupsLoading = ref(false);
const groupsPage = ref(0);
const groupsPageSize = 20;
const groupsHasMore = ref(true);

const filter = ref([1])
const viewMode = ref("grid")

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


const resource_tree_nodes = [
  {value: 'my-resources', label: 'My resources'},
  {value: 'favorite', label: 'Favorites'},
  {value: 'featured', label: 'Featured'},
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
  {value: 'dashboard', label: 'dashboards'},
  {value: 'remote', label: 'Remote'},
]


const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

const toggleViewMode = () => {
  viewMode.value = viewMode.value === "grid" ? "list" : "grid"
}

// Función para actualizar los query params en la URL cuando se seleccionan nodos
const updateQueryParams = () => {

  const queryParams = {...route.query}

  console.log("queryParams", queryParams)

  // Obtener los nodos hijos del tipo 'dataset'
  const datasetNode = resource_tree_nodes.find(node => node.value === 'dataset')
  const datasetChildren: any[] = datasetNode.children.map(child => child.value) || []
  let datasetSelected = false

  // Verificar si todos los hijos de 'dataset' están seleccionados
  const datasetTicked = ticked.value.filter(item => datasetChildren.includes(item))
  const allDatasetChildrenSelected = datasetTicked.length === datasetChildren.length

  // Creamos los query params f para cada nodo ticked
  let filters: LocationQueryValue[]
  filters = ticked.value.reduce<LocationQueryValue[]>((acc, item) => {
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

  // Agregamos los filtros de categorías desde `categoriesList`
  if (!!categoriesSelected.value && categoriesSelected.value.length > 0) {
    queryParams[`filter{category.identifier.in}`] = categoriesSelected.value
  } else {
    delete queryParams[`filter{category.identifier.in}`]
  }

  if (!!keywordsSelected.value && keywordsSelected.value.length > 0) {
    queryParams[`filter{keywords.slug.in}`] = keywordsSelected.value
  } else {
    delete queryParams[`filter{keywords.slug.in}`]
  }

  if (!!regionsSelected.value && regionsSelected.value.length > 0) {
    queryParams[`filter{regions.code.in}`] = regionsSelected.value
  } else {
    delete queryParams[`filter{regions.code.in}`]
  }

  if (!!ownersSelected.value && ownersSelected.value.length > 0) {
    queryParams[`filter{owner.pk.in}`] = ownersSelected.value
  } else {
    delete queryParams[`filter{owner.pk.in}`]
  }

  if (!!groupsSelected.value && groupsSelected.value.length > 0) {
    queryParams[`filter{group.in}`] = groupsSelected.value
  } else {
    delete queryParams[`filter{group.in}`]
  }

  if (catalogueStore.filterUsingExtent === true) {
    console.log("catalogueStore.filterExtent", catalogueStore.filterExtent)
    const [xmin, ymin, xmax, ymax] = catalogueStore.filterExtent
    queryParams.extent = `${xmin},${ymin},${xmax},${ymax}`
  } else {
    console.log("catalogueStore.filterExtent", catalogueStore.filterExtent)
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
    const selectedValues = Array.isArray(queryParamsTicked) ? queryParamsTicked : [queryParamsTicked]
    ticked.value = selectedValues.filter((value) => {
      return resource_tree_nodes.some(node => {
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
    categoriesSelected.value = Array.isArray(queryParamsCategories) ? queryParamsCategories : [queryParamsCategories]

    while (!categoriesSelected.value.every(selectedKey =>
        categoriesList.value.some(category => category.key === selectedKey))) {
      await fetchCategories();
    }

  }

  if (queryParamsKeywords) {
    keywordsSelected.value = Array.isArray(queryParamsKeywords) ? queryParamsKeywords : [queryParamsKeywords]

    while (!keywordsSelected.value.every(selectedKey =>
        keywordsList.value.some(keyword => keyword.key === selectedKey))) {
      await fetchKeywords();
    }
  }

  if (queryParamsRegions) {
    regionsSelected.value = Array.isArray(queryParamsRegions) ? queryParamsRegions : [queryParamsRegions]

    while (!regionsSelected.value.every(selectedKey =>
        regionsList.value.some(region => region.key === selectedKey))) {
      await fetchRegions();
    }
  }

  if (queryParamsOwners) {
    ownersSelected.value = Array.isArray(queryParamsOwners) ? queryParamsOwners : [queryParamsOwners]

    while (!ownersSelected.value.every(selectedKey =>
        ownersList.value.some(owner => owner.key === selectedKey))) {
      await fetchOwners();
    }
  }

  if (queryParamsGroups) {
    groupsSelected.value = Array.isArray(queryParamsGroups) ? queryParamsGroups : [queryParamsGroups]

    while (!groupsSelected.value.every(selectedKey =>
        groupsList.value.some(group => group.key === selectedKey))) {
      await fetchGroups();
    }
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
}

// Función para cargar categorías usando useFetch
const fetchCategories = async () => {
  if (categoriesLoading.value || !categoriesHasMore.value) return;
  categoriesLoading.value = true;

  try {
    const {data} = await useFetch<FacetsResponse>(`https://development.demo.geonode.org/api/v2/facets/category?page=${categoriesPage.value}&page_size=${categoriesPageSize}`);
    if (data.value) {
      const newCategories = data.value.topics.items;
      if (newCategories.length > 0) {
        categoriesList.value.push(...newCategories);
        categoriesPage.value++;
      } else {
        categoriesHasMore.value = false;
      }
    }
  } catch (error) {
    console.error('Error fetching categories:', error);
  } finally {
    categoriesLoading.value = false;
  }
};

// Manejar el evento de scroll
const handleCategoriesScroll = ({to}: ScrollEvent) => {
  if (!categoriesLoading.value && categoriesHasMore.value && to === categoriesList.value.length - 1) {
    fetchCategories();
  }
};

const fetchKeywords = async () => {
  if (keywordsLoading.value || !keywordsHasMore.value) return;
  keywordsLoading.value = true;

  try {
    const {data} = await useFetch<FacetsResponse>(`https://development.demo.geonode.org/api/v2/facets/keyword?page=${keywordsPage.value}&page_size=${keywordsPageSize}`);
    if (data.value) {
      const newKeywords = data.value.topics.items;
      if (newKeywords.length > 0) {
        keywordsList.value.push(...newKeywords);
        keywordsPage.value++;
      } else {
        keywordsHasMore.value = false;
      }
    }
  } catch (error) {
    console.error('Error fetching keywords:', error);
  } finally {
    keywordsLoading.value = false;
  }
};

// Manejar el evento de scroll
const handleKeywordsScroll = ({to}: ScrollEvent) => {
  if (!keywordsLoading.value && keywordsHasMore.value && to === keywordsList.value.length - 1) {
    fetchKeywords();
  }
}

const fetchRegions = async () => {
  if (regionsLoading.value || !regionsHasMore.value) return;
  regionsLoading.value = true;

  try {
    const {data} = await useFetch<FacetsResponse>(`https://development.demo.geonode.org/api/v2/facets/region?page=${regionsPage.value}&page_size=${regionsPageSize}`);
    console.log("data", data.value)
    if (data.value) {
      const newRegions = data.value.topics.items;
      if (newRegions.length > 0) {
        regionsList.value.push(...newRegions);
        regionsPage.value++;
      } else {
        regionsHasMore.value = false;
      }
    }
  } catch (error) {
    console.error('Error fetching regions:', error);
  } finally {
    regionsLoading.value = false;
  }
}

const handleRegionsScroll = ({to}: ScrollEvent) => {
  if (!regionsLoading.value && regionsHasMore.value && to === regionsList.value.length - 1) {
    fetchRegions();
  }
}

const fetchOwners = async () => {
  if (ownersLoading.value || !ownersHasMore.value) return;
  ownersLoading.value = true;

  try {
    const {data} = await useFetch<FacetsResponse>(`https://development.demo.geonode.org/api/v2/facets/owner?page=${ownersPage.value}&page_size=${ownersPageSize}`);
    console.log("data", data.value)
    if (data.value) {
      const newOwners = data.value.topics.items;
      if (newOwners.length > 0) {
        ownersList.value.push(...newOwners);
        ownersPage.value++;
      } else {
        ownersHasMore.value = false;
      }
    }
  } catch (error) {
    console.error('Error fetching owners:', error);
  } finally {
    ownersLoading.value = false;
  }
};

const handleOwnersScroll = ({to}: ScrollEvent) => {
  if (!ownersLoading.value && ownersHasMore.value && to === ownersList.value.length - 1) {
    fetchOwners();
  }
}

const fetchGroups = async () => {
  if (groupsLoading.value || !groupsHasMore.value) return;
  groupsLoading.value = true;

  try {
    const {data} = await useFetch<FacetsResponse>(`https://development.demo.geonode.org/api/v2/facets/group?page=${groupsPage.value}&page_size=${groupsPageSize}`);
    console.log("data", data.value)
    if (data.value) {
      const newGroups = data.value.topics.items;
      if (newGroups.length > 0) {
        groupsList.value.push(...newGroups);
        groupsPage.value++;
      } else {
        groupsHasMore.value = false;
      }
    }
  } catch (error) {
    console.error('Error fetching groups:', error);
  } finally {
    groupsLoading.value = false;
  }
};

const handleGroupsScroll = ({to}: ScrollEvent) => {
  if (!groupsLoading.value && groupsHasMore.value && to === groupsList.value.length - 1) {
    fetchGroups();
  }
}

watch(() => leftDrawerOpen.value, (value) => {
  if (value) {
    if (!categoriesList.value.length) fetchCategories()
    if (!keywordsList.value.length) fetchKeywords()
    if (!regionsList.value.length) fetchRegions()
    if (!ownersList.value.length) fetchOwners()
    if (!groupsList.value.length) fetchGroups()
  }
})

// Inicializamos el estado de 'ticked' cuando se monta el componente
onMounted(() => {
  initializeTickedFromQuery()
})

// Observamos los cambios en 'ticked' para actualizar la URL
watch([ticked, search, categoriesSelected, keywordsSelected, regionsSelected, ownersSelected, groupsSelected, () => catalogueStore.filterUsingExtent, () => catalogueStore.filterExtent], () => {
  updateQueryParams()
})

</script>
