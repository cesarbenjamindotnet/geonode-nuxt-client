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
      <q-drawer v-model="catalogueStore.leftDrawerOpen" side="left" bordered behavior="desktop"
                :width="leftDrawerWidth">
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

            <CatalogueInputSearch/>

            <div v-if="false" class="row">
              <b>Resources</b>
            </div>
            <div v-if="false" class="row q-pb-md" style="margin-top: 0">
              <q-tree
                  :nodes="filteredResourceTreeNodes"
                  v-model:ticked="tickedResourceTreeNodes"
                  node-key="value"
                  tick-strategy="leaf"
                  default-expand-all
                  no-connectors
              />
            </div>

            <CatalogueSelectCategories/>

            <CatalogueSelectKeywords/>

            <CatalogueSelectRegions/>

            <CatalogueSelectOwners/>

            <CatalogueSelectGroups/>

            <CatalogueDateFrom/>

            <CatalogueDateTo/>

            <div class="row">
              <q-toggle
                  v-model="catalogueStore.filterUsingExtent"
                  checked-icon="mdi-map"
                  color="primary"
                  label="Extent"
                  unchecked-icon="clear"
              />
            </div>

            <CatalogueFilterExtentMap/>

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

const tickedResourceTreeNodes = ref<LocationQueryValue[]>([])


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
  catalogueStore.leftDrawerOpen = !catalogueStore.leftDrawerOpen
}

const toggleViewMode = () => {
  viewMode.value = viewMode.value === "grid" ? "list" : "grid"
}

// Función para actualizar los query params en la URL cuando se seleccionan nodos
const updateQueryParams = () => {
  const queryParams = {...route.query}

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

  // Navegamos a la URL con los nuevos query params
  router.push({query: queryParams})
}

// Función para inicializar el estado de 'ticked' según los query params
const initializeTickedFromQuery = async () => {
  const queryParamsTicked: LocationQueryValue | LocationQueryValue[] | undefined = route.query.f

  if (Object.keys(route.query).length > 0) {
    catalogueStore.leftDrawerOpen = true
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

}

onMounted(() => {
  if (Object.keys(route.query).length > 0) {
    setTimeout(() => {
      catalogueStore.leftDrawerOpen = true
    }, 800)
  }

  setTimeout(() => {
    if (catalogueStore.hasPreviousRoute === false) {
      console.log("no previous route")

      initializeTickedFromQuery()

    } else {
      console.log("si previous route")
    }
  }, 100)
})

watch(
    [
      tickedResourceTreeNodes,
    ],
    () => {
      setTimeout(() => {
        updateQueryParams()
      }, 200)
    }
)

</script>
