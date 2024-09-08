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
      <q-drawer v-model="leftDrawerOpen" side="left" bordered behavior="desktop">
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
                        multiple use-input class="full-width" @scroll="handleCategoriesScroll"
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
                        class="full-width" @scroll="handleKeywordsScroll" :loading="keywordsLoading"/>
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
        <p>aaa</p>
        <p>aaa</p>
        <p>aaa</p>
        <p>aaa</p>
        <p>aaa</p>
        <p>aaa</p>
        <p>aaa</p>
        <p>aaa</p>
        <p>aaa</p>
        <p>aaa</p>
        <p>aaa</p>
        <p>aaa</p>
        <p>aaa</p>
        <p>aaa</p>
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
const catalogueStore = useCatalogueStore()
const router = useRouter()
const route = useRoute()
const $q = useQuasar()

const leftDrawerOpen = ref(false)

const search = ref("")
const ticked = ref([])

const categoriesList = ref([]);
const categoriesSelected = ref([]);
const categoriesLoading = ref(false);
const categoriesPage = ref(0);
const categoriesPageSize = 20;
const categoriesHasMore = ref(true);

const keywordsList = ref([]);
const keywordsSelected = ref([]);
const keywordsLoading = ref(false);
const keywordsPage = ref(0);
const keywordsPageSize = 20;
const keywordsHasMore = ref(true);

const regionsList = ref([]);
const regionsSelected = ref([]);
const regionsLoading = ref(false);
const regionsPage = ref(0);
const regionsPageSize = 20;
const regionsHasMore = ref(true);

const ownersList = ref([]);
const ownersSelected = ref([]);
const ownersLoading = ref(false);
const ownersPage = ref(0);
const ownersPageSize = 20;
const ownersHasMore = ref(true);

const groupsList = ref([]);
const groupsSelected = ref([]);
const groupsLoading = ref(false);
const groupsPage = ref(0);
const groupsPageSize = 20;
const groupsHasMore = ref(true);

const filter = ref([1])
const viewMode = ref("grid")

const childLayoutHeight = computed(() => {
  return $q.screen.height - 117
})

const resource_types = [
  {value: "all", label: "All"},
  {value: "dataset", label: "Datasets"},
  {value: "map", label: "Maps"},
  {value: "document", label: "documents"},
  {value: "geostory", label: "Geostories"},
  {value: "dashboard", label: "Dashboards"},
]

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
const updateQueryParams = (selected) => {
  const queryParams = {...route.query}

  // Obtener los nodos hijos del tipo 'dataset'
  const datasetNode = resource_tree_nodes.find(node => node.value === 'dataset')
  const datasetChildren = datasetNode?.children?.map(child => child.value) || []
  let datasetSelected = false

  // Verificar si todos los hijos de 'dataset' están seleccionados
  const datasetTicked = selected.filter(item => datasetChildren.includes(item))
  const allDatasetChildrenSelected = datasetTicked.length === datasetChildren.length

  // Creamos los query params f para cada nodo ticked
  let filters = selected.reduce((acc, item) => {
    // Si es un hijo de dataset
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
  queryParams.q = search.value || undefined

  // Navegamos a la URL con los nuevos query params
  router.push({query: queryParams})
}

// Función para inicializar el estado de 'ticked' según los query params
const initializeTickedFromQuery = () => {
  const queryParamsTicked = route.query.f
  const queryParamsSearch = route.query.q

  if (queryParamsTicked) {
    const selectedValues = Array.isArray(queryParamsTicked) ? queryParamsTicked : [queryParamsTicked]
    ticked.value = selectedValues.filter((value) => {
      // Validamos que los valores existan en los nodos del árbol
      return resource_tree_nodes.some(node => {
        if (node.value === value) return true
        if (node.children) {
          return node.children.some(child => child.value === value)
        }
        return false
      })
    })
    if (ticked.value.length > 0) {
      leftDrawerOpen.value = true
    }
  }
  if (queryParamsSearch) {
    if (typeof queryParamsSearch === "string") {
      search.value = queryParamsSearch
    }
  }
}

// Función para cargar categorías usando useFetch
const fetchCategories = async () => {
  if (categoriesLoading.value || !categoriesHasMore.value) return;
  categoriesLoading.value = true;

  try {
    const {data} = await useFetch(`https://development.demo.geonode.org/api/v2/facets/category?page=${categoriesPage.value}&pageSize=${categoriesPageSize}`);
    console.log("data", data.value)
    const newCategories = data.value.topics.items; // Ajusta esto según la estructura de tu respuesta API

    if (newCategories.length > 0) {
      categoriesList.value.push(...newCategories);
      categoriesPage.value++;
    } else {
      categoriesHasMore.value = false;
    }
  } catch (error) {
    console.error('Error fetching categories:', error);
  } finally {
    categoriesLoading.value = false;
  }
};

// Manejar el evento de scroll
const handleCategoriesScroll = (event) => {
  const bottom = event.target.scrollHeight === event.target.scrollTop + event.target.clientHeight;
  if (bottom) {
    fetchCategories();
  }
};

const fetchKeywords = async () => {
  if (keywordsLoading.value || !keywordsHasMore.value) return;
  keywordsLoading.value = true;

  try {
    const {data} = await useFetch(`https://development.demo.geonode.org/api/v2/facets/keyword?page=${keywordsPage.value}&pageSize=${keywordsPageSize}`);
    console.log("data", data.value)
    const newKeywords = data.value.topics.items; // Ajusta esto según la estructura de tu respuesta API

    if (newKeywords.length > 0) {
      keywordsList.value.push(...newKeywords);
      keywordsPage.value++;
    } else {
      keywordsHasMore.value = false;
    }
  } catch (error) {
    console.error('Error fetching keywords:', error);
  } finally {
    keywordsLoading.value = false;
  }
};

// Manejar el evento de scroll
const handleKeywordsScroll = (event) => {
  const bottom = event.target.scrollHeight === event.target.scrollTop + event.target.clientHeight;
  if (bottom) {
    fetchKeywords();
  }
};


const fetchRegions = async () => {
  if (regionsLoading.value || !regionsHasMore.value) return;
  regionsLoading.value = true;

  try {
    const {data} = await useFetch(`https://development.demo.geonode.org/api/v2/facets/region?page=${regionsPage.value}&pageSize=${regionsPageSize}`);
    console.log("data", data.value)
    const newRegions = data.value.topics.items; // Ajusta esto según la estructura de tu respuesta API

    if (newRegions.length > 0) {
      regionsList.value.push(...newRegions);
      regionsPage.value++;
    } else {
      regionsHasMore.value = false;
    }
  } catch (error) {
    console.error('Error fetching regions:', error);
  } finally {
    regionsLoading.value = false;
  }
};

// Manejar el evento de scroll
const handleRegionsScroll = (event) => {
  const bottom = event.target.scrollHeight === event.target.scrollTop + event.target.clientHeight;
  if (bottom) {
    fetchRegions();
  }
};


const fetchOwners = async () => {
  if (ownersLoading.value || !ownersHasMore.value) return;
  ownersLoading.value = true;

  try {
    const {data} = await useFetch(`https://development.demo.geonode.org/api/v2/facets/owner?page=${ownersPage.value}&pageSize=${ownersPageSize}`);
    console.log("data", data.value)
    const newOwners = data.value.topics.items; // Ajusta esto según la estructura de tu respuesta API

    if (newOwners.length > 0) {
      ownersList.value.push(...newOwners);
      ownersPage.value++;
    } else {
      ownersHasMore.value = false;
    }
  } catch (error) {
    console.error('Error fetching owners:', error);
  } finally {
    ownersLoading.value = false;
  }
};

// Manejar el evento de scroll
const handleOwnersScroll = (event) => {
  const bottom = event.target.scrollHeight === event.target.scrollTop + event.target.clientHeight;
  if (bottom) {
    fetchOwners();
  }
};


const fetchGroups = async () => {
  if (groupsLoading.value || !groupsHasMore.value) return;
  groupsLoading.value = true;

  try {
    const {data} = await useFetch(`https://development.demo.geonode.org/api/v2/facets/group?page=${groupsPage.value}&pageSize=${groupsPageSize}`);
    console.log("data", data.value)
    const newGroups = data.value.topics.items; // Ajusta esto según la estructura de tu respuesta API

    if (newGroups.length > 0) {
      groupsList.value.push(...newGroups);
      groupsPage.value++;
    } else {
      groupsHasMore.value = false;
    }
  } catch (error) {
    console.error('Error fetching groups:', error);
  } finally {
    groupsLoading.value = false;
  }
};

// Manejar el evento de scroll
const handleGroupsScroll = (event) => {
  const bottom = event.target.scrollHeight === event.target.scrollTop + event.target.clientHeight;
  if (bottom) {
    fetchGroups();
  }
};


// Inicializamos el estado de 'ticked' cuando se monta el componente
onMounted(() => {
  initializeTickedFromQuery()
  fetchCategories()
  fetchKeywords()
  fetchRegions()
  fetchOwners()
  fetchGroups()
})

// Observamos los cambios en 'ticked' para actualizar la URL
watch([ticked, search], () => {
  updateQueryParams(ticked.value)
})

</script>

<style scoped>
.q-page-container {
  padding-top: 87px; /* Ajusta este valor según la altura del header del hijo */
}
</style>